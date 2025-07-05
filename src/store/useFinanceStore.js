import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateId } from '@/lib/utils';

// API functions for MongoDB operations
const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

const useFinanceStore = create(
  persist(
    (set, get) => ({
      // State
      transactions: [],
      budgets: [],
      loading: false,
      error: null,

      // Actions
      setLoading: loading => set({ loading }),
      setError: error => set({ error }),

      // Transaction actions
      fetchTransactions: async () => {
        set({ loading: true, error: null });
        try {
          const data = await apiRequest('/api/transactions');
          set({ transactions: data.transactions, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      addTransaction: async transaction => {
        set({ loading: true, error: null });
        try {
          const newTransaction = { ...transaction, id: generateId() };
          const data = await apiRequest('/api/transactions', {
            method: 'POST',
            body: JSON.stringify(newTransaction),
          });

          set(state => ({
            transactions: [...state.transactions, data.transaction],
            loading: false,
          }));

          return data.transaction;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateTransaction: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const data = await apiRequest(`/api/transactions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
          });

          set(state => ({
            transactions: state.transactions.map(t =>
              t.id === id ? data.transaction : t
            ),
            loading: false,
          }));

          return data.transaction;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      deleteTransaction: async id => {
        set({ loading: true, error: null });
        try {
          await apiRequest(`/api/transactions/${id}`, {
            method: 'DELETE',
          });

          set(state => ({
            transactions: state.transactions.filter(t => t.id !== id),
            loading: false,
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Budget actions
      fetchBudgets: async () => {
        set({ loading: true, error: null });
        try {
          const data = await apiRequest('/api/budgets');
          set({ budgets: data.budgets, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      addBudget: async budget => {
        set({ loading: true, error: null });
        try {
          const newBudget = { ...budget, id: generateId() };
          const data = await apiRequest('/api/budgets', {
            method: 'POST',
            body: JSON.stringify(newBudget),
          });

          set(state => ({
            budgets: [...state.budgets, data.budget],
            loading: false,
          }));

          return data.budget;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateBudget: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const data = await apiRequest(`/api/budgets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
          });

          set(state => ({
            budgets: state.budgets.map(b => (b.id === id ? data.budget : b)),
            loading: false,
          }));

          return data.budget;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      deleteBudget: async id => {
        set({ loading: true, error: null });
        try {
          await apiRequest(`/api/budgets/${id}`, {
            method: 'DELETE',
          });

          set(state => ({
            budgets: state.budgets.filter(b => b.id !== id),
            loading: false,
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Initialize data
      initializeData: async () => {
        const { fetchTransactions, fetchBudgets } = get();
        await Promise.all([fetchTransactions(), fetchBudgets()]);
      },

      // Clear all data
      clearData: () => set({ transactions: [], budgets: [], error: null }),
    }),
    {
      name: 'finance-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        // Only persist transactions and budgets, not loading states
        transactions: state.transactions,
        budgets: state.budgets,
      }),
    }
  )
);

export default useFinanceStore;
