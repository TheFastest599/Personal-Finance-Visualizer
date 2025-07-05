'use client';

import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
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
import { formatCurrency, getMonthName, getMonthlyData } from '@/lib/utils';

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

  const hasData = months.some(m => m.expenses > 0);

  // Chart configuration for shadcn/ui
  const chartConfig = {
    expenses: {
      label: 'Monthly Expenses',
      color: 'hsl(var(--chart-1))',
    },
  };

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
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={months}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={value => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="expenses" fill="var(--chart-1)" radius={8} />
            </BarChart>
          </ChartContainer>
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
