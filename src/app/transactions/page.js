'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Transactions() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEditTransaction = transaction => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Transactions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your income and expenses
            </p>
          </div>
          <Button
            onClick={handleAddTransaction}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transaction Form */}
          <Card className={`${showForm ? 'lg:col-span-1' : 'hidden'}`}>
            <CardHeader>
              <CardTitle>
                {editingTransaction
                  ? 'Edit Transaction'
                  : 'Add New Transaction'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionForm
                transaction={editingTransaction}
                onSuccess={handleCloseForm}
                onCancel={handleCloseForm}
              />
            </CardContent>
          </Card>

          {/* Transaction List */}
          <Card className={`${showForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionList onEdit={handleEditTransaction} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
