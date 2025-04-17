import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import TopNavBar from './TopNavBar';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:w-64">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavBar onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6 pb-20 lg:pb-6">
          {children}
        </main>
        
        <MobileNav />
      </div>
    </div>
  );
}
