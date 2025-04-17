import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { insertExpenseSchema, InsertExpense } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CATEGORIES } from '@/lib/utils/categories';

const expenseFormSchema = insertExpenseSchema.extend({
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: 'Amount must be a positive number' }
  ),
  date: z.string().min(1, 'Date is required'),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export default function ExpenseForm() {
  const { toast } = useToast();
  const [expenseType, setExpenseType] = useState<'expense' | 'income'>('expense');
  
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      type: 'expense',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: InsertExpense) => {
      const res = await apiRequest('POST', '/api/expenses', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: `${expenseType === 'expense' ? 'Expense' : 'Income'} has been added successfully.`,
      });
      form.reset({
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        type: 'expense',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add ${expenseType}: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ExpenseFormValues) => {
    const numericAmount = Number(data.amount);
    mutate({
      ...data,
      amount: numericAmount,
      type: expenseType,
    });
  };

  const handleTypeChange = (type: 'expense' | 'income') => {
    setExpenseType(type);
    form.setValue('type', type);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Add New {expenseType === 'expense' ? 'Expense' : 'Income'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-1 mb-4">
          <Button
            type="button"
            variant={expenseType === 'expense' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => handleTypeChange('expense')}
          >
            Expense
          </Button>
          <Button
            type="button"
            variant={expenseType === 'income' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
            onClick={() => handleTypeChange('income')}
          >
            Income
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500">$</span>
                      </div>
                      <Input placeholder="0.00" {...field} className="pl-7" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What was this for?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Adding...' : `Add ${expenseType === 'expense' ? 'Expense' : 'Income'}`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
