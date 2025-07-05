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
  getMonthName,
  getMonthlyData,
  calculateCategoryTotals,
} from '@/lib/utils';

export default function MonthlyExpensesChart() {
  const { transactions, loading, error, initializeData } = useFinanceStore();

  useEffect(() => {
    if (transactions.length === 0) {
      initializeData();
    }
  }, [transactions.length, initializeData]);

  // Guard against undefined transactions
  const safeTransactions = transactions || [];

  // Get data for the last 6 months
  const currentDate = new Date();
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthData = getMonthlyData(
      safeTransactions,
      date.getFullYear(),
      date.getMonth()
    );
    const totalExpenses = monthData.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    months.push({
      month: getMonthName(date.getMonth()).substring(0, 3),
      year: date.getFullYear(),
      expenses: totalExpenses,
      transactionCount: monthData.length,
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{`${label} ${data.year}`}</p>
          <p className="text-primary font-semibold">
            {`Expenses: ${formatCurrency(data.expenses)}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {`${data.transactionCount} transaction${
              data.transactionCount !== 1 ? 's' : ''
            }`}
          </p>
        </div>
      );
    }
    return null;
  };

  const maxExpense = Math.max(...months.map(m => m.expenses));
  const hasData = months.some(m => m.expenses > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>
          Your spending trend over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={months}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                className="text-sm"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                className="text-sm"
                tick={{ fontSize: 12 }}
                tickFormatter={value =>
                  value >= 1000
                    ? `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
                    : `$${value}`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="expenses"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">
                No expense data available
              </p>
              <p className="text-sm">
                Add some transactions to see your monthly spending trend
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
