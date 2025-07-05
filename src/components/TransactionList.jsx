'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useFinanceStore from '@/store/useFinanceStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Edit2, Trash2, Calendar, Tag, Filter } from 'lucide-react';

export default function TransactionList({ onEdit }) {
  const { transactions, loading, error, deleteTransaction, initializeData } =
    useFinanceStore();
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (transactions.length === 0) {
      initializeData();
    }
  }, [transactions.length, initializeData]);

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-500">Error loading transactions: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Tag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first transaction to track your finances.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Filter transactions based on type
  const filteredTransactions = sortedTransactions.filter(transaction => {
    if (typeFilter === 'all') return true;
    return transaction.type === typeFilter;
  });

  // Helper function to get amount display with color
  const getAmountDisplay = transaction => {
    const amount = transaction.amount;
    const isIncome = transaction.type === 'income';
    const displayAmount = isIncome
      ? `+${formatCurrency(amount)}`
      : `-${formatCurrency(amount)}`;
    const colorClass = isIncome ? 'text-green-600' : 'text-red-600';

    return { displayAmount, colorClass };
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="income">Income Only</SelectItem>
            <SelectItem value="expense">Expenses Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {filteredTransactions.map(transaction => {
          const { displayAmount, colorClass } = getAmountDisplay(transaction);

          return (
            <Card
              key={transaction.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className=" px-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-base sm:text-lg truncate">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs w-fit">
                          {transaction.category}
                        </Badge>
                        <Badge
                          variant={
                            transaction.type === 'income'
                              ? 'default'
                              : 'destructive'
                          }
                          className="text-xs w-fit"
                        >
                          {transaction.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs sm:text-sm">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col sm:items-end justify-between sm:justify-start gap-2">
                    <span
                      className={`text-xl sm:text-2xl font-bold ${colorClass}`}
                    >
                      {displayAmount}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit && onEdit(transaction)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
