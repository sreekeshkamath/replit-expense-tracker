import { Link, useLocation } from 'wouter';
import { 
  Home, 
  List, 
  PieChart, 
  Calendar, 
  Settings, 
  Wallet 
} from 'lucide-react';

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5 mr-3" /> },
    { name: 'Transactions', path: '/transactions', icon: <List className="w-5 h-5 mr-3" /> },
    { name: 'Analytics', path: '/analytics', icon: <PieChart className="w-5 h-5 mr-3" /> },
    { name: 'Budgets', path: '/budgets', icon: <Calendar className="w-5 h-5 mr-3" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5 mr-3" /> },
  ];

  return (
    <aside className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mr-3">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">ExpenseTracker</h1>
        </div>
        
        <nav>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                  location === item.path 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      
      <div className="mt-auto px-6 py-4 border-t border-slate-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-sm font-medium text-slate-600">JD</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-700">John Doe</p>
            <p className="text-xs text-slate-500">john@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
