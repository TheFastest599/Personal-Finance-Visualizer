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
  formatDate,
  getMonthName,
  getCurrentMonth,
  getCurrentYear,
  getMonthlyData,
  calculateCategoryTotals,
} from '@/lib/utils';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Tag,
  Receipt,
  CreditCard,
} from 'lucide-react';

export default function DashboardSummary() {
  const { transactions, loading, error, initializeData } = useFinanceStore();

  useEffect(() => {
    if (transactions.length === 0) {
      initializeData();
    }
  }, [transactions.length, initializeData]);

  // Guard against undefined transactions
  const safeTransactions = transactions || [];

  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();
  const currentMonthTransactions = getMonthlyData(
    safeTransactions,
    currentYear,
    currentMonth
  );
  const currentMonthTotal = currentMonthTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );
  const currentMonthCount = currentMonthTransactions.length;

  // Previous month comparison
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonthTransactions = getMonthlyData(
    safeTransactions,
    prevYear,
    prevMonth
  );
  const prevMonthTotal = prevMonthTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  const monthlyChange =
    prevMonthTotal > 0
      ? ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100
      : 0;
  const isIncreased = monthlyChange > 0;

  // Total all-time statistics
  const totalSpent = safeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = safeTransactions.length;

  // Most expensive transaction this month
  const mostExpensive =
    currentMonthTransactions.length > 0
      ? currentMonthTransactions.reduce(
          (max, t) => (t.amount > max.amount ? t : max),
          currentMonthTransactions[0]
        )
      : null;

  // Most frequent category this month
  const categoryTotals = calculateCategoryTotals(currentMonthTransactions);
  const topCategory =
    Object.entries(categoryTotals).length > 0
      ? Object.entries(categoryTotals).reduce(
          (max, [category, amount]) =>
            amount > max.amount ? { category, amount } : max,
          { category: '', amount: 0 }
        )
      : null;

  // Recent transactions (last 3)
  const recentTransactions = [...safeTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading data: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Current Month Spending */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(currentMonthTotal)}
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {monthlyChange !== 0 && (
              <div
                className={`flex items-center ${
                  isIncreased ? 'text-red-600' : 'text-green-600'
                }`}
              >
                <TrendingUp
                  className={`h-3 w-3 mr-1 ${
                    isIncreased ? 'rotate-0' : 'rotate-180'
                  }`}
                />
                {Math.abs(monthlyChange).toFixed(1)}% from last month
              </div>
            )}
            {monthlyChange === 0 && <span>No change from last month</span>}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Count */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentMonthCount}</div>
          <p className="text-xs text-muted-foreground">
            {getMonthName(currentMonth)} {currentYear}
          </p>
        </CardContent>
      </Card>

      {/* Total All-Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
          <p className="text-xs text-muted-foreground">
            {totalTransactions} total transactions
          </p>
        </CardContent>
      </Card>

      {/* Top Category */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {topCategory && topCategory.amount > 0 ? (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(topCategory.amount)}
              </div>
              <p className="text-xs text-muted-foreground">
                {topCategory.category}
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                No data this month
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Most Expensive Transaction */}
      {mostExpensive && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Largest Transaction This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{mostExpensive.description}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {formatDate(mostExpensive.date)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">
                  {formatCurrency(mostExpensive.amount)}
                </div>
                <Badge variant="secondary">{mostExpensive.category}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Recent Transactions
          </CardTitle>
          <CardDescription>Your latest spending activity</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              <p className="text-sm">No transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
