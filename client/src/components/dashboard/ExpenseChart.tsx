import { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Expense } from '@shared/schema';
import { formatCurrency } from '@/lib/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TimeRange = '7d' | '1m' | '3m' | '1y';

interface ExpenseChartProps {
  expenses: Expense[];
}

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');

  // Get date range based on selected option
  const getDateRange = () => {
    const endDate = new Date();
    let startDate: Date;
    let interval: 'day' | 'month';
    
    switch (timeRange) {
      case '7d':
        startDate = subDays(endDate, 6);
        interval = 'day';
        break;
      case '3m':
        startDate = startOfMonth(subDays(endDate, 90));
        interval = 'month';
        break;
      case '1y':
        startDate = startOfMonth(subDays(endDate, 365));
        interval = 'month';
        break;
      default: // 1m
        startDate = startOfMonth(endDate);
        interval = 'day';
    }
    
    return { startDate, endDate, interval };
  };

  const { startDate, endDate, interval } = getDateRange();

  // Generate chart data
  const getChartData = () => {
    if (interval === 'day') {
      // Daily data
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      
      return days.map(day => {
        const dayExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return format(expenseDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') && 
                 expense.type === 'expense';
        });
        
        const dayIncomes = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return format(expenseDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') && 
                 expense.type === 'income';
        });
        
        const totalExpense = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const totalIncome = dayIncomes.reduce((sum, e) => sum + Number(e.amount), 0);
        
        return {
          date: format(day, timeRange === '7d' ? 'MMM d' : 'd'),
          expense: totalExpense,
          income: totalIncome
        };
      });
    } else {
      // Monthly data
      const months = eachDayOfInterval({ start: startDate, end: endDate })
        .filter(date => date.getDate() === 1);
      
      return months.map(month => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        
        const monthExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd }) && 
                 expense.type === 'expense';
        });
        
        const monthIncomes = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd }) && 
                 expense.type === 'income';
        });
        
        const totalExpense = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const totalIncome = monthIncomes.reduce((sum, e) => sum + Number(e.amount), 0);
        
        return {
          date: format(month, 'MMM yy'),
          expense: totalExpense,
          income: totalIncome
        };
      });
    }
  };

  const chartData = getChartData();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Expense Overview</CardTitle>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="1m">This month</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="1y">This year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                tickFormatter={(value) => 
                  value === 0 ? '0' : 
                  value < 1000 ? `$${value}` : 
                  `$${(value / 1000).toFixed(1)}k`
                } 
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), '']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                name="Expenses" 
                stroke="#ef4444" 
                fill="rgba(239, 68, 68, 0.1)" 
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                name="Income" 
                stroke="#10b981" 
                fill="rgba(16, 185, 129, 0.1)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
