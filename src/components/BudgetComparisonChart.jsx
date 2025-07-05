'use client';

import { useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import useFinanceStore from '@/store/useFinanceStore';
import {
  formatCurrency,
  getCurrentMonth,
  getCurrentYear,
  getMonthlyData,
  calculateCategoryTotals,
} from '@/lib/utils';

export default function BudgetComparisonChart() {
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
  const currentMonthTransactions = getMonthlyData(
    safeTransactions,
    currentYear,
    currentMonth
  );
  const categorySpending = calculateCategoryTotals(currentMonthTransactions);

  // Get current month budgets - since budgets don't have month/year fields,
  // we'll use all budgets that are monthly period for current comparison
  const currentBudgets = safeBudgets.filter(
    budget => budget.period === 'monthly'
  );

  // Combine budget and actual data
  const chartData = currentBudgets.map(budget => ({
    category: budget.category,
    budget: budget.amount,
    actual: categorySpending[budget.category] || 0,
    remaining: Math.max(
      0,
      budget.amount - (categorySpending[budget.category] || 0)
    ),
    overBudget: Math.max(
      0,
      (categorySpending[budget.category] || 0) - budget.amount
    ),
  }));

  const hasData = chartData.length > 0;

  // Chart configuration for shadcn/ui
  const chartConfig = {
    budget: {
      label: 'Budget',
      color: 'var(--chart-1)',
    },
    actual: {
      label: 'Actual',
      color: 'var(--chart-2)',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Spending</CardTitle>
        <CardDescription>
          Compare your planned budget with actual spending for{' '}
          {new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={value => value.slice(0, 8)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
              <Bar dataKey="actual" fill="var(--color-actual)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">
                No budget data available
              </p>
              <p className="text-sm">
                Set up budgets to see comparison with actual spending
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
