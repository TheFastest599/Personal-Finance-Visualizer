'use client';

import { useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
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
  calculateCategoryTotals,
  getColorForCategory,
} from '@/lib/utils';

export default function CategoryPieChart() {
  const { transactions, loading, error, initializeData } = useFinanceStore();

  useEffect(() => {
    if (transactions.length === 0) {
      initializeData();
    }
  }, [transactions.length, initializeData]);

  // Guard against undefined transactions
  const safeTransactions = transactions || [];

  const categoryTotals = calculateCategoryTotals(safeTransactions);

  const data = Object.entries(categoryTotals)
    .map(([category, amount], index) => ({
      name: category,
      value: amount,
      color: getColorForCategory(category, index),
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage =
        total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <p className="font-medium">{data.payload.name}</p>
          </div>
          <p className="text-primary font-semibold">
            {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-muted-foreground">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="truncate">{entry.value}</span>
        </div>
      ))}
    </div>
  );

  const hasData = data.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>
          Breakdown of your expenses by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-6 ">
              <h4 className="text-sm font-medium mb-3">Category Breakdown</h4>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {data.map((item, index) => {
                  const percentage =
                    total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(item.value)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {percentage}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">
                No category data available
              </p>
              <p className="text-sm">
                Add some transactions to see your spending breakdown
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
