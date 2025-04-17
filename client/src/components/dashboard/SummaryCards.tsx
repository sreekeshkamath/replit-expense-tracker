import { useQuery } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, Wallet, PiggyBank } from 'lucide-react';
import { Expense } from '@shared/schema';
import { formatCurrency } from '@/lib/utils/formatters';

interface SummaryCardsProps {
  currentMonthExpenses: Expense[];
  prevMonthExpenses: Expense[];
}

export default function SummaryCards({ currentMonthExpenses, prevMonthExpenses }: SummaryCardsProps) {
  // Calculate totals
  const totalSpent = currentMonthExpenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const prevMonthSpent = prevMonthExpenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalIncome = currentMonthExpenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const prevMonthIncome = prevMonthExpenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  // Calculate percentage changes
  const spentPercentage = prevMonthSpent > 0
    ? Math.round(((totalSpent - prevMonthSpent) / prevMonthSpent) * 100)
    : 0;

  const incomePercentage = prevMonthIncome > 0
    ? Math.round(((totalIncome - prevMonthIncome) / prevMonthIncome) * 100)
    : 0;

  // Calculate budget utilization
  const remainingBudget = Math.max(0, totalIncome - totalSpent);
  const budgetPercentage = totalIncome > 0 ? Math.round((totalSpent / totalIncome) * 100) : 0;

  // Calculate savings
  const monthlySavings = Math.max(0, totalIncome - totalSpent);
  const savingsPercentage = totalIncome > 0 ? Math.round((monthlySavings / totalIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Spent Card */}
      <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Spent</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <ArrowDown className="text-red-500 h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <span className={`text-xs font-semibold flex items-center ${spentPercentage > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            {spentPercentage === 0 ? (
              <span>--</span>
            ) : (
              <>
                {spentPercentage > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                <span>{Math.abs(spentPercentage)}%</span>
              </>
            )}
          </span>
          <span className="text-xs text-slate-500 ml-2">vs last month</span>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Income</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <ArrowUp className="text-emerald-500 h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <span className={`text-xs font-semibold flex items-center ${incomePercentage > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {incomePercentage === 0 ? (
              <span>--</span>
            ) : (
              <>
                {incomePercentage > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                <span>{Math.abs(incomePercentage)}%</span>
              </>
            )}
          </span>
          <span className="text-xs text-slate-500 ml-2">vs last month</span>
        </div>
      </div>

      {/* Remaining Budget Card */}
      <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Remaining Budget</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(remainingBudget)}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Wallet className="text-blue-500 h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                budgetPercentage > 90 ? 'bg-red-500' : 
                budgetPercentage > 70 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, budgetPercentage)}%` }}
            ></div>
          </div>
          <span className="text-xs text-slate-500 ml-2">{budgetPercentage}%</span>
        </div>
      </div>

      {/* Savings Card */}
      <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Monthly Savings</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(monthlySavings)}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <PiggyBank className="text-primary h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <span className="text-primary text-xs font-semibold flex items-center">
            <ArrowUp className="h-3 w-3 mr-1" />
            <span>{savingsPercentage}%</span>
          </span>
          <span className="text-xs text-slate-500 ml-2">of monthly income</span>
        </div>
      </div>
    </div>
  );
}
