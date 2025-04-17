import { useQuery, useMutation } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Expense, InsertExpense } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

export function useExpenses() {
  // Get all expenses
  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
  });

  // Add a new expense
  const addExpense = useMutation({
    mutationFn: async (data: InsertExpense) => {
      const res = await apiRequest('POST', '/api/expenses', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
    },
  });

  // Delete an expense
  const deleteExpense = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/expenses/${id}`, undefined);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
    },
  });

  // Get expenses for current month
  const getCurrentMonthExpenses = () => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });
  };

  // Get total spent for the current month
  const getTotalSpent = () => {
    return getCurrentMonthExpenses()
      .filter(expense => expense.type === 'expense')
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  };

  // Get total income for the current month
  const getTotalIncome = () => {
    return getCurrentMonthExpenses()
      .filter(expense => expense.type === 'income')
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
  };

  // Get expenses grouped by category
  const getExpensesByCategory = () => {
    const categoryMap = new Map<string, number>();
    
    getCurrentMonthExpenses()
      .filter(expense => expense.type === 'expense')
      .forEach(expense => {
        const currentAmount = categoryMap.get(expense.category) || 0;
        categoryMap.set(expense.category, currentAmount + Number(expense.amount));
      });
    
    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  };

  return {
    expenses,
    isLoading,
    addExpense,
    deleteExpense,
    getCurrentMonthExpenses,
    getTotalSpent,
    getTotalIncome,
    getExpensesByCategory
  };
}
