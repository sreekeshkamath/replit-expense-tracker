import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SummaryCards from './SummaryCards';
import ExpenseChart from './ExpenseChart';
import RecentTransactions from './RecentTransactions';
import ExpenseForm from './ExpenseForm';
import ExpenseCategories from './ExpenseCategories';
import { Expense } from '@shared/schema';

export default function ExpenseDashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const prevMonth = startOfMonth(subMonths(currentMonth, 1));
  const prevMonthEnd = endOfMonth(subMonths(currentMonth, 1));

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
  });

  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
  });

  const prevMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return isWithinInterval(expenseDate, { start: prevMonth, end: prevMonthEnd });
  });

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (nextMonth <= new Date()) {
      setCurrentMonth(nextMonth);
    }
  };

  const handleExport = () => {
    const headers = 'Date,Amount,Category,Description,Type\n';
    const csvContent = currentMonthExpenses.map(expense => {
      return `${format(new Date(expense.date), 'yyyy-MM-dd')},${expense.amount},${expense.category},"${expense.description || ''}",${expense.type}`;
    }).join('\n');

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `expenses-${format(currentMonth, 'yyyy-MM')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <div className="mt-3 sm:mt-0 flex gap-3">
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="mt-1 flex items-center">
          <span className="text-sm font-medium text-slate-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 inline mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <div className="ml-4 flex items-center">
            <button
              type="button"
              className="p-1 text-slate-400 hover:text-slate-700"
              aria-label="Previous month"
              onClick={handlePreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="p-1 text-slate-400 hover:text-slate-700"
              aria-label="Next month"
              onClick={handleNextMonth}
              disabled={format(new Date(), 'yyyy-MM') === format(currentMonth, 'yyyy-MM')}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards 
        currentMonthExpenses={currentMonthExpenses} 
        prevMonthExpenses={prevMonthExpenses} 
      />

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Chart & Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <ExpenseChart expenses={expenses} />
          <RecentTransactions expenses={expenses} />
        </div>

        {/* Right Column - Add Expense & Categories */}
        <div className="space-y-6">
          <ExpenseForm />
          <ExpenseCategories expenses={currentMonthExpenses} />
        </div>
      </div>
    </div>
  );
}
