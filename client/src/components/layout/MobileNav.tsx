import { Link, useLocation } from 'wouter';
import { Home, List, PlusCircle, PieChart, User } from 'lucide-react';

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="text-lg" /> },
    { name: 'Transactions', path: '/transactions', icon: <List className="text-lg" /> },
    { name: 'Add', path: '/add', icon: <PlusCircle className="text-lg" /> },
    { name: 'Analytics', path: '/analytics', icon: <PieChart className="text-lg" /> },
    { name: 'Profile', path: '/profile', icon: <User className="text-lg" /> },
  ];

  return (
    <div className="lg:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center w-full ${
              location === item.path ? 'text-primary' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
