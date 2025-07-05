'use client';

import Navigation from '@/components/Navigation';
import DashboardSummary from '@/components/DashboardSummary';
import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import SpendingInsights from '@/components/SpendingInsights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get an overview of your financial health
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8">
          <DashboardSummary />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <MonthlyExpensesChart />

          <CategoryPieChart />
        </div>

        {/* Insights Section */}
        <div className="mb-8">
          <SpendingInsights />
        </div>
      </div>
    </div>
  );
}
