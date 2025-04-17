import { ReactNode } from 'react';
import { 
  ShoppingBag, 
  Home, 
  Utensils, 
  Zap, 
  Car, 
  HeartPulse, 
  PlaneTakeoff, 
  Briefcase, 
  Gamepad, 
  Droplets, 
  Shirt, 
  GraduationCap 
} from 'lucide-react';

export interface CategoryIcon {
  name: string;
  icon: ReactNode;
  color: string; // For chart
  bgColor: string; // For icon background
}

export const CATEGORIES: CategoryIcon[] = [
  {
    name: 'Food & Dining',
    icon: <Utensils className="h-4 w-4 text-primary" />,
    color: '#7c3aed',
    bgColor: '#f3e8ff',
  },
  {
    name: 'Shopping',
    icon: <ShoppingBag className="h-4 w-4 text-red-500" />,
    color: '#ef4444',
    bgColor: '#fee2e2',
  },
  {
    name: 'Housing',
    icon: <Home className="h-4 w-4 text-blue-500" />,
    color: '#0ea5e9',
    bgColor: '#e0f2fe',
  },
  {
    name: 'Transportation',
    icon: <Car className="h-4 w-4 text-emerald-500" />,
    color: '#10b981',
    bgColor: '#d1fae5',
  },
  {
    name: 'Utilities',
    icon: <Zap className="h-4 w-4 text-amber-500" />,
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  {
    name: 'Health',
    icon: <HeartPulse className="h-4 w-4 text-pink-500" />,
    color: '#ec4899',
    bgColor: '#fce7f3',
  },
  {
    name: 'Travel',
    icon: <PlaneTakeoff className="h-4 w-4 text-indigo-500" />,
    color: '#6366f1',
    bgColor: '#e0e7ff',
  },
  {
    name: 'Entertainment',
    icon: <Gamepad className="h-4 w-4 text-violet-500" />,
    color: '#8b5cf6',
    bgColor: '#ede9fe',
  },
  {
    name: 'Personal',
    icon: <Shirt className="h-4 w-4 text-sky-500" />,
    color: '#0ea5e9',
    bgColor: '#e0f2fe',
  },
  {
    name: 'Work',
    icon: <Briefcase className="h-4 w-4 text-slate-500" />,
    color: '#64748b',
    bgColor: '#f1f5f9',
  },
  {
    name: 'Education',
    icon: <GraduationCap className="h-4 w-4 text-orange-500" />,
    color: '#f97316',
    bgColor: '#ffedd5',
  },
  {
    name: 'Other',
    icon: <Droplets className="h-4 w-4 text-gray-500" />,
    color: '#6b7280',
    bgColor: '#f3f4f6',
  }
];

export function getCategoryIcon(categoryName: string): { icon: ReactNode; bgColor: string } {
  const category = CATEGORIES.find(cat => cat.name === categoryName);
  
  if (category) {
    return {
      icon: category.icon,
      bgColor: category.bgColor
    };
  }
  
  // Default if category not found
  return {
    icon: <Droplets className="h-4 w-4 text-gray-500" />,
    bgColor: '#f3f4f6'
  };
}

export function getCategoryColor(categoryName: string): string {
  const category = CATEGORIES.find(cat => cat.name === categoryName);
  return category ? category.color : '#6b7280';
}