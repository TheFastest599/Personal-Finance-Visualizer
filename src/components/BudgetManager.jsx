'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import useFinanceStore from '@/store/useFinanceStore';
import {
  formatCurrency,
  EXPENSE_CATEGORIES,
  validateBudgetData,
} from '@/lib/utils';

export default function BudgetManager() {
  const {
    budgets,
    transactions,
    loading,
    error,
    initializeData,
    addBudget,
    updateBudget,
    deleteBudget,
  } = useFinanceStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly',
  });

  useEffect(() => {
    if (budgets.length === 0) {
      initializeData();
    }
  }, [budgets.length, initializeData]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = value => {
    setFormData(prev => ({
      ...prev,
      category: value,
    }));
  };

  const handlePeriodChange = value => {
    setFormData(prev => ({
      ...prev,
      period: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateBudgetData(formData)) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const budgetData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (editingBudget) {
        await updateBudget(editingBudget.id, budgetData);
      } else {
        await addBudget(budgetData);
      }

      setIsOpen(false);
      setEditingBudget(null);
      setFormData({
        category: '',
        amount: '',
        period: 'monthly',
      });
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget. Please try again.');
    }
  };

  const handleEdit = budget => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
    });
    setIsOpen(true);
  };

  const handleDelete = async budgetId => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(budgetId);
      } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Failed to delete budget. Please try again.');
      }
    }
  };

  const getBudgetProgress = budget => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear &&
        transaction.category === budget.category &&
        (transaction.type === 'expense' || !transaction.type) // Include existing data without type field
      );
    });

    const totalSpent = monthlyTransactions.reduce(
      (sum, transaction) => sum + Math.abs(transaction.amount),
      0
    );

    return {
      spent: totalSpent,
      remaining: Math.max(0, budget.amount - totalSpent),
      percentage: Math.min(100, (totalSpent / budget.amount) * 100),
    };
  };

  const getProgressColor = percentage => {
    if (percentage <= 50) return 'bg-green-500';
    if (percentage <= 75) return 'bg-yellow-500';
    if (percentage <= 90) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Manager</CardTitle>
          <CardDescription>Loading budgets...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Manager</CardTitle>
          <CardDescription className="text-red-500">
            Error loading budgets: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Budget Manager</CardTitle>
            <CardDescription>
              Set and track your spending limits by category
            </CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingBudget(null);
                  setFormData({
                    category: '',
                    amount: '',
                    period: 'monthly',
                  });
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBudget ? 'Edit Budget' : 'Add New Budget'}
                </DialogTitle>
                <DialogDescription>
                  Create a budget to track your spending in a specific category.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Budget Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter budget amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <Select
                    value={formData.period}
                    onValueChange={handlePeriodChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingBudget ? 'Update Budget' : 'Add Budget'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <div className="text-center py-8 max-h-screen overflow-y-auto">
            <p className="text-gray-500 mb-4">No budgets created yet.</p>
            <p className="text-sm text-gray-400">
              Click "Add Budget" to create your first budget.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {budgets.map(budget => {
              const progress = getBudgetProgress(budget);
              const progressColor = getProgressColor(progress.percentage);

              return (
                <div key={budget.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{budget.category}</h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {budget.period} budget
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(budget)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(budget.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spent: {formatCurrency(progress.spent)}</span>
                      <span>Budget: {formatCurrency(budget.amount)}</span>
                    </div>
                    <Progress value={progress.percentage} />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{progress.percentage.toFixed(1)}% used</span>
                      <span>
                        {progress.remaining > 0
                          ? `${formatCurrency(progress.remaining)} remaining`
                          : `${formatCurrency(
                              progress.spent - budget.amount
                            )} over budget`}
                      </span>
                    </div>
                  </div>

                  {progress.percentage > 90 && (
                    <div className="mt-2">
                      <Badge
                        variant={
                          progress.percentage >= 100 ? 'destructive' : 'default'
                        }
                      >
                        {progress.percentage >= 100
                          ? 'Over Budget'
                          : 'Near Limit'}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
