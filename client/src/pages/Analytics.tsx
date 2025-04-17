import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Expense } from '@shared/schema';
import { formatCurrency } from '@/lib/utils/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCategoryColor, CATEGORIES } from '@/lib/utils/categories';

type TimeRange = '1m' | '3m' | '6m' | '1y';
type ChartView = 'category' | 'monthly';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [chartView, setChartView] = useState<ChartView>('category');
  
  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
  });

  // Filter expenses based on time range
  const getDateRange = () => {
    const endDate = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '3m':
        startDate = subMonths(endDate, 3);
        break;
      case '6m':
        startDate = subMonths(endDate, 6);
        break;
      case '1y':
        startDate = subMonths(endDate, 12);
        break;
      default: // 1m
        startDate = subMonths(endDate, 1);
    }
    
    return { startDate, endDate };
  };

  const { startDate, endDate } = getDateRange();
  
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return isWithinInterval(expenseDate, { start: startDate, end: endDate }) && 
           expense.type === 'expense';
  });

  // Calculate total amount by category
  const categoryData = CATEGORIES.map(category => {
    const total = filteredExpenses
      .filter(e => e.category === category.name)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    
    return {
      name: category.name,
      value: total,
      color: category.color
    };
  }).filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  // Calculate monthly expenses
  const getMonthlyData = () => {
    const months = Array.from({ length: timeRange === '1m' ? 1 : 
                              timeRange === '3m' ? 3 : 
                              timeRange === '6m' ? 6 : 12 }, 
                              (_, i) => subMonths(new Date(), i));
    
    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthExpenses = filteredExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
      });
      
      const total = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      
      return {
        name: format(month, 'MMM yy'),
        amount: total
      };
    }).reverse();
  };

  const monthlyData = getMonthlyData();

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        
        <div className="mt-3 sm:mt-0 flex gap-3">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as TimeRange)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last month</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 flex justify-center">
          <p>Loading analytics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                <p className="text-xs text-slate-500 mt-1">
                  {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Top Category</CardTitle>
              </CardHeader>
              <CardContent>
                {categoryData.length > 0 ? (
                  <>
                    <div className="text-2xl font-bold">{categoryData[0].name}</div>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatCurrency(categoryData[0].value)} ({Math.round(categoryData[0].value / totalExpenses * 100)}% of total)
                    </p>
                  </>
                ) : (
                  <div className="text-slate-500">No data available</div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Average Monthly</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalExpenses / monthlyData.filter(m => m.amount > 0).length || 0)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Based on your spending pattern
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={chartView} onValueChange={(v) => setChartView(v as ChartView)}>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Expense Breakdown</h3>
                <TabsList>
                  <TabsTrigger value="category">By Category</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="category" className="mt-4">
                {categoryData.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => [formatCurrency(value), 'Amount']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div>
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">%</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {categoryData.map((category, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                                  <span className="text-sm text-slate-800">{category.name}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-slate-800">
                                {formatCurrency(category.value)}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-slate-800">
                                {Math.round(category.value / totalExpenses * 100)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-slate-500">No expense data available for the selected period</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="monthly" className="mt-4">
                {monthlyData.some(m => m.amount > 0) ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis 
                          tickFormatter={(value) => 
                            value === 0 ? '0' : 
                            value < 1000 ? `$${value}` : 
                            `$${(value / 1000).toFixed(1)}k`
                          } 
                        />
                        <Tooltip formatter={(value: number) => [formatCurrency(value), 'Expenses']} />
                        <Legend />
                        <Bar dataKey="amount" name="Total Expenses" fill="#7c3aed" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-slate-500">No expense data available for the selected period</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}
    </div>
  );
}
