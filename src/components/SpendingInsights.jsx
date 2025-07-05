'use client';

import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useFinanceStore from '@/store/useFinanceStore';
import {
  formatCurrency,
  getMonthName,
  getMonthlyData,
  calculateCategoryTotals,
  getCurrentMonth,
  getCurrentYear,
} from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  Target,
  Calendar,
} from 'lucide-react';

export default function SpendingInsights() {
  const { transactions, budgets, loading, error, initializeData } =
    useFinanceStore();

  useEffect(() => {
    if (transactions.length === 0) {
      initializeData();
    }
  }, [transactions.length, initializeData]);

  // Guard against undefined data
  const safeTransactions = transactions || [];
  const safeBudgets = budgets || [];

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  // Current month data
  const currentMonthTransactions = getMonthlyData(
    safeTransactions,
    currentYear,
    currentMonth
  );
  const currentMonthSpending = currentMonthTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );
  const currentCategorySpending = calculateCategoryTotals(
    currentMonthTransactions
  );

  // Previous month data
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonthTransactions = getMonthlyData(
    safeTransactions,
    prevYear,
    prevMonth
  );
  const prevMonthSpending = prevMonthTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );
  const prevCategorySpending = calculateCategoryTotals(prevMonthTransactions);

  // Calculate insights
  const insights = [];

  // Monthly spending trend
  if (prevMonthSpending > 0) {
    const monthlyChange =
      ((currentMonthSpending - prevMonthSpending) / prevMonthSpending) * 100;
    if (Math.abs(monthlyChange) > 5) {
      insights.push({
        type: monthlyChange > 0 ? 'warning' : 'positive',
        icon: monthlyChange > 0 ? TrendingUp : TrendingDown,
        title: 'Monthly Spending Trend',
        description: `Your spending ${
          monthlyChange > 0 ? 'increased' : 'decreased'
        } by ${Math.abs(monthlyChange).toFixed(1)}% compared to last month`,
        value: formatCurrency(
          Math.abs(currentMonthSpending - prevMonthSpending)
        ),
        details: `${getMonthName(prevMonth)}: ${formatCurrency(
          prevMonthSpending
        )} → ${getMonthName(currentMonth)}: ${formatCurrency(
          currentMonthSpending
        )}`,
      });
    }
  }

  // Budget alerts
  const currentBudgets = safeBudgets.filter(
    b => b.month === currentMonth && b.year === currentYear
  );
  currentBudgets.forEach(budget => {
    const spent = currentCategorySpending[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;

    if (percentage > 100) {
      insights.push({
        type: 'danger',
        icon: AlertTriangle,
        title: 'Budget Exceeded',
        description: `You've exceeded your ${budget.category} budget by ${(
          percentage - 100
        ).toFixed(1)}%`,
        value: formatCurrency(spent - budget.amount),
        details: `Budget: ${formatCurrency(
          budget.amount
        )} | Spent: ${formatCurrency(spent)}`,
      });
    } else if (percentage > 80) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Budget Warning',
        description: `You've used ${percentage.toFixed(1)}% of your ${
          budget.category
        } budget`,
        value: formatCurrency(budget.amount - spent),
        details: `${formatCurrency(spent)} spent of ${formatCurrency(
          budget.amount
        )} budget`,
      });
    }
  });

  // Category spending changes
  Object.keys(currentCategorySpending).forEach(category => {
    const current = currentCategorySpending[category];
    const previous = prevCategorySpending[category] || 0;

    if (previous > 0) {
      const categoryChange = ((current - previous) / previous) * 100;
      if (categoryChange > 50 && current > 100) {
        // Significant increase and meaningful amount
        insights.push({
          type: 'info',
          icon: TrendingUp,
          title: 'Category Spending Spike',
          description: `Your ${category} spending increased by ${categoryChange.toFixed(
            1
          )}% this month`,
          value: formatCurrency(current - previous),
          details: `Previous: ${formatCurrency(
            previous
          )} | Current: ${formatCurrency(current)}`,
        });
      }
    }
  });

  // Top spending category
  if (Object.keys(currentCategorySpending).length > 0) {
    const topCategory = Object.entries(currentCategorySpending).sort(
      ([, a], [, b]) => b - a
    )[0];

    const percentage = (topCategory[1] / currentMonthSpending) * 100;
    if (percentage > 40) {
      insights.push({
        type: 'info',
        icon: Target,
        title: 'Top Spending Category',
        description: `${topCategory[0]} represents ${percentage.toFixed(
          1
        )}% of your total spending`,
        value: formatCurrency(topCategory[1]),
        details: `Consider if this allocation aligns with your financial goals`,
      });
    }
  }

  // Recent high spending days
  const recentHighSpendingDays = [];
  const transactionsByDate = {};

  currentMonthTransactions.forEach(transaction => {
    const date = transaction.date;
    if (!transactionsByDate[date]) {
      transactionsByDate[date] = 0;
    }
    transactionsByDate[date] += transaction.amount;
  });

  const avgDailySpending = currentMonthSpending / new Date().getDate();
  Object.entries(transactionsByDate).forEach(([date, amount]) => {
    if (amount > avgDailySpending * 2 && amount > 200) {
      recentHighSpendingDays.push({ date, amount });
    }
  });

  if (recentHighSpendingDays.length > 0) {
    const highestDay = recentHighSpendingDays.sort(
      (a, b) => b.amount - a.amount
    )[0];
    insights.push({
      type: 'info',
      icon: Calendar,
      title: 'High Spending Day',
      description: `You had a high spending day on ${new Date(
        highestDay.date
      ).toLocaleDateString()}`,
      value: formatCurrency(highestDay.amount),
      details: `This was ${(highestDay.amount / avgDailySpending).toFixed(
        1
      )}x your average daily spending`,
    });
  }

  // Savings opportunity
  if (currentBudgets.length > 0) {
    const totalBudget = currentBudgets.reduce((sum, b) => sum + b.amount, 0);
    const totalActual = Object.values(currentCategorySpending).reduce(
      (sum, amount) => sum + amount,
      0
    );
    if (totalActual < totalBudget) {
      const savings = totalBudget - totalActual;
      insights.push({
        type: 'positive',
        icon: TrendingDown,
        title: 'Under Budget',
        description: `You're ${formatCurrency(
          savings
        )} under your total monthly budget`,
        value: formatCurrency(savings),
        details: `Great job staying within your spending limits!`,
      });
    }
  }

  const getInsightColor = type => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          badge: 'bg-red-100 text-red-800',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          badge: 'bg-yellow-100 text-yellow-800',
        };
      case 'positive':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          badge: 'bg-green-100 text-green-800',
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          badge: 'bg-blue-100 text-blue-800',
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
        <CardDescription>
          AI-powered insights about your spending patterns and trends
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[35vh] overflow-y-auto">
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.slice(0, 6).map((insight, index) => {
              // Limit to 6 insights
              const colors = getInsightColor(insight.type);
              const Icon = insight.icon;

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${colors.text}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-medium ${colors.text}`}>
                          {insight.title}
                        </h4>
                        <Badge className={colors.badge}>{insight.value}</Badge>
                      </div>
                      <p className={`text-sm ${colors.text} mb-2`}>
                        {insight.description}
                      </p>
                      <p className={`text-xs opacity-75 ${colors.text}`}>
                        {insight.details}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Info className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium mb-2">
              No insights available yet
            </p>
            <p className="text-sm">
              Add more transactions and set up budgets to get personalized
              spending insights
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
