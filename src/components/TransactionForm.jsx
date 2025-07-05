'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useFinanceStore from '@/store/useFinanceStore';
import {
  PREDEFINED_CATEGORIES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  validateTransaction,
} from '@/lib/utils';

export default function TransactionForm({ transaction, onSuccess, onCancel }) {
  const { addTransaction, updateTransaction, loading } = useFinanceStore();

  const [formData, setFormData] = useState(() => ({
    amount: transaction?.amount?.toString() || '',
    description: transaction?.description || '',
    category: transaction?.category || '',
    type: transaction?.type || 'expense',
    date: transaction?.date || new Date().toISOString().split('T')[0],
  }));
  const [errors, setErrors] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();

    const transactionData = {
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      category: formData.category,
      type: formData.type,
      date: formData.date,
    };

    const validation = validateTransaction(transactionData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      if (transaction) {
        await updateTransaction(transaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      setFormData({
        amount: '',
        description: '',
        category: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      setErrors({ submit: 'Failed to save transaction. Please try again.' });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md">
          {errors.submit}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="type">Transaction Type</Label>
        <Select
          value={formData.type}
          onValueChange={value => handleChange('type', value)}
        >
          <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">💸 Expense</SelectItem>
            <SelectItem value="income">💰 Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-red-600 text-sm">{errors.type}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={e => handleChange('amount', e.target.value)}
          className={errors.amount ? 'border-red-500' : ''}
        />
        {errors.amount && (
          <p className="text-red-600 text-sm">{errors.amount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Enter description"
          value={formData.description}
          onChange={e => handleChange('description', e.target.value)}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-red-600 text-sm">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={value => handleChange('category', value)}
        >
          <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {(formData.type === 'income'
              ? INCOME_CATEGORIES
              : EXPENSE_CATEGORIES
            ).map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-red-600 text-sm">{errors.category}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={e => handleChange('date', e.target.value)}
          className={errors.date ? 'border-red-500' : ''}
        />
        {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
      </div>

      <div className="flex space-x-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading
            ? 'Saving...'
            : transaction
            ? 'Update Transaction'
            : 'Add Transaction'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
