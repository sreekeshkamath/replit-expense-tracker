import { Bell, Moon, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TopNavBarProps {
  onMenuClick: () => void;
}

export default function TopNavBar({ onMenuClick }: TopNavBarProps) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center lg:hidden">
          <button 
            type="button" 
            className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            onClick={onMenuClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-slate-800 ml-2">ExpenseTracker</h1>
        </div>
        
        <div className="hidden lg:flex items-center flex-1 px-2 space-x-2">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input 
              type="text" 
              placeholder="Search transactions..." 
              className="pl-10 pr-3 py-2" 
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button type="button" className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
          
          <div className="relative">
            <button type="button" className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              <Moon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center lg:hidden">
            <span className="text-sm font-medium text-slate-600">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
