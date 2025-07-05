'use client';

import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import SpendingInsights from '@/components/SpendingInsights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useFinanceStore from '@/store/useFinanceStore';
import { formatCurrency } from '@/lib/utils';

export default function Analytics() {
  const { transactions, loading, error, initializeData } = useFinanceStore();

  useEffect(() => {
    if (transactions.length === 0) {
      initializeData();
    }
  }, [transactions.length, initializeData]);

  // Calculate analytics data
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  const avgTransaction =
    transactions.length > 0
      ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
      : 0;

  const categoryTotals = transactions.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  )[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed insights into your financial patterns
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Net Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-xl sm:text-2xl font-bold ${
                  netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(netIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {formatCurrency(avgTransaction)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          <MonthlyExpensesChart />

          <CategoryPieChart />
        </div>

        {/* Additional Stats */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-4">
                {Object.entries(categoryTotals)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount]) => (
                    <div
                      key={category}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                        {category}
                      </span>
                      <span className="text-sm font-bold">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Facts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Transactions
                  </span>
                  <span className="text-sm font-bold">
                    {transactions.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Top Category
                  </span>
                  <span className="text-sm font-bold capitalize">
                    {topCategory ? topCategory[0] : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Expense Ratio
                  </span>
                  <span className="text-sm font-bold">
                    {totalIncome > 0
                      ? `${((totalExpenses / totalIncome) * 100).toFixed(1)}%`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Section */}
        <div className="mb-8">
          <SpendingInsights />
        </div>
      </div>
    </div>
  );
}
