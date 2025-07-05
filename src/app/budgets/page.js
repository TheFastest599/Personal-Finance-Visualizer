'use client';

import Navigation from '@/components/Navigation';
import BudgetManager from '@/components/BudgetManager';
import BudgetComparisonChart from '@/components/BudgetComparisonChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Budgets() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Budget Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set and track your monthly spending limits
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Budget Manager */}
          <BudgetManager />

          {/* Budget Comparison Chart */}
          <BudgetComparisonChart />
        </div>
      </div>
    </div>
  );
}
