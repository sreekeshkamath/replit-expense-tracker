import { useState } from 'react';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import { Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@shared/schema';
import { formatCurrency } from '@/lib/utils/formatters';
import { getCategoryIcon } from '@/lib/utils/categories';

interface RecentTransactionsProps {
  expenses: Expense[];
}

export default function RecentTransactions({ expenses }: RecentTransactionsProps) {
  const [_, setLocation] = useLocation();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sort transactions by date
  const sortedTransactions = [...expenses]
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    })
    .slice(0, 5);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const viewAllTransactions = () => {
    setLocation('/transactions');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 text-slate-500 hover:text-primary" onClick={toggleSortOrder}>
            <ArrowUpDown className="mr-1 h-4 w-4" />
            Sort
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-slate-500 hover:text-primary">
            <Filter className="mr-1 h-4 w-4" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-slate-200">
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((transaction) => {
              const { icon, bgColor } = getCategoryIcon(transaction.category);
              const isIncome = transaction.type === 'income';

              return (
                <div
                  key={transaction.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center mr-3`}
                      style={{ backgroundColor: bgColor }}
                    >
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {transaction.description || transaction.category}
                      </p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(transaction.date), 'MMM d, yyyy')} • {transaction.category}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-slate-500">
              No transactions found. Add some expenses to get started.
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            className="text-sm font-medium text-primary hover:text-primary/90"
            onClick={viewAllTransactions}
          >
            View All Transactions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
