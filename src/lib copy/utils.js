import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getMonthName(monthIndex) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[monthIndex];
}

export function getCurrentMonth() {
  return new Date().getMonth();
}

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getMonthlyData(transactions, year, month) {
  if (!transactions || !Array.isArray(transactions)) {
    return [];
  }
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getFullYear() === year &&
      transactionDate.getMonth() === month
    );
  });
}

export function groupTransactionsByCategory(transactions) {
  if (!transactions || !Array.isArray(transactions)) {
    return {};
  }
  const grouped = {};
  transactions.forEach(transaction => {
    if (!grouped[transaction.category]) {
      grouped[transaction.category] = [];
    }
    grouped[transaction.category].push(transaction);
  });
  return grouped;
}

export function calculateCategoryTotals(transactions) {
  if (!transactions || !Array.isArray(transactions)) {
    return {};
  }
  const totals = {};
  transactions.forEach(transaction => {
    if (!totals[transaction.category]) {
      totals[transaction.category] = 0;
    }
    totals[transaction.category] += transaction.amount;
  });
  return totals;
}

export function validateTransaction(transaction) {
  const errors = {};

  if (!transaction.amount || transaction.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!transaction.description?.trim()) {
    errors.description = 'Description is required';
  }

  if (!transaction.category) {
    errors.category = 'Category is required';
  }

  if (!transaction.type) {
    errors.type = 'Transaction type is required';
  }

  if (!transaction.date) {
    errors.date = 'Date is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateBudgetData(budgetData) {
  if (!budgetData.category || budgetData.category.trim() === '') {
    return false;
  }

  if (!budgetData.amount || parseFloat(budgetData.amount) <= 0) {
    return false;
  }

  if (!budgetData.period) {
    return false;
  }

  return true;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const PREDEFINED_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Groceries',
  'Rent',
  'Insurance',
  'Other',
];

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Groceries',
  'Rent',
  'Insurance',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Rental Income',
  'Gift',
  'Bonus',
  'Refund',
  'Side Hustle',
  'Other Income',
];

export const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
  '#8dd1e1',
  '#d084d0',
  '#ffb347',
  '#87d068',
  '#ff9f40',
  '#6fa8dc',
  '#ea4335',
  '#34a853',
  '#fbbc04',
  '#4285f4',
  '#9aa0a6',
];

export function getColorForCategory(category, index) {
  return COLORS[index % COLORS.length];
}

export function calculateBudgetProgress(spent, budget) {
  if (budget === 0) return 0;
  return Math.min((spent / budget) * 100, 100);
}

export function getBudgetStatus(spent, budget) {
  const percentage = calculateBudgetProgress(spent, budget);
  if (percentage >= 100) return 'over';
  if (percentage >= 80) return 'warning';
  return 'good';
}

export function generateMonthlyReportData(transactions, year, month) {
  const monthlyTransactions = getMonthlyData(transactions, year, month);
  const categoryTotals = calculateCategoryTotals(monthlyTransactions);
  const totalSpent = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
  const transactionCount = monthlyTransactions.length;

  return {
    totalSpent,
    transactionCount,
    categoryTotals,
    transactions: monthlyTransactions,
    month: getMonthName(month),
    year,
  };
}
