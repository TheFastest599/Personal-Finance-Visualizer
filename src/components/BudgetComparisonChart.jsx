'use client';

import { useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-blue-600">Budget: </span>
              <span className="font-semibold">
                {formatCurrency(data.budget)}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-green-600">Actual: </span>
              <span className="font-semibold">
                {formatCurrency(data.actual)}
              </span>
            </p>
            <p className="text-sm">
              {data.overBudget > 0 ? (
                <>
                  <span className="text-red-600">Over Budget: </span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(data.overBudget)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-green-600">Under Budget: </span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(data.remaining)}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const hasData = chartData.length > 0;

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
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="category"
                className="text-sm"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                className="text-sm"
                tick={{ fontSize: 12 }}
                tickFormatter={value => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="budget"
                name="Budget"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
              <Bar
                dataKey="actual"
                name="Actual"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
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
