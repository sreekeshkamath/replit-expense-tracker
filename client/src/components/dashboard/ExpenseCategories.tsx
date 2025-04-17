import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@shared/schema';
import { formatCurrency } from '@/lib/utils/formatters';
import { getCategoryIcon, CATEGORIES } from '@/lib/utils/categories';

interface ExpenseCategoriesProps {
  expenses: Expense[];
}

export default function ExpenseCategories({ expenses }: ExpenseCategoriesProps) {
  // Filter only expenses (not income)
  const expenseItems = useMemo(() => 
    expenses.filter(expense => expense.type === 'expense'),
    [expenses]
  );

  // Calculate total spent
  const totalSpent = useMemo(() => 
    expenseItems.reduce((sum, expense) => sum + Number(expense.amount), 0),
    [expenseItems]
  );

  // Group expenses by category
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    // Initialize with zero for all categories
    CATEGORIES.forEach(category => {
      categoryMap.set(category.name, 0);
    });
    
    // Add up expenses for each category
    expenseItems.forEach(expense => {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + Number(expense.amount));
    });
    
    // Convert to array and sort by amount (descending)
    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ 
        name, 
        value,
        percentage: totalSpent > 0 ? Math.round((value / totalSpent) * 100) : 0
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [expenseItems, totalSpent]);

  // Get colors for pie chart
  const categoryColors = useMemo(() => 
    categoryData.map(category => {
      const categoryInfo = CATEGORIES.find(c => c.name === category.name);
      return categoryInfo ? categoryInfo.color : '#cbd5e1';
    }),
    [categoryData]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Expense by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {categoryData.length > 0 ? (
          <>
            <div className="space-y-3">
              {categoryData.slice(0, 5).map((category, index) => {
                const { icon, bgColor } = getCategoryIcon(category.name);
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: bgColor }}
                      >
                        {icon}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800">{formatCurrency(category.value)}</p>
                      <p className="text-xs text-slate-500">{category.percentage}% of total</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                    labelFormatter={(name) => `${name}`} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-slate-500">
            No expenses yet. Add some expenses to see your category breakdown.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
