import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BriefcaseBusiness, 
  ClipboardList, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  onLogout: () => void;
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Create Job', icon: BriefcaseBusiness, path: '/create-job' },
    { name: 'Manage Jobs', icon: ClipboardList, path: '/manage-jobs' },
    { name: 'Talent Bank', icon: Users, path: '/talent-bank' },
    { name: 'Reports', icon: BarChart3, path: '/reports' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-full">
      {/* Mobile sidebar toggle */}
      <button
        type="button"
        className="lg:hidden fixed z-50 bottom-4 right-4 p-3 rounded-full bg-gradient-primary text-white shadow-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 bg-dark-800 border-r border-dark-700 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-dark-700">
            <div className="flex items-center">
              <span className="text-xl font-bold gradient-text">TalentLink</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-gradient-primary text-white'
                      : 'text-dark-200 hover:bg-dark-700'
                  }`}
                >
                  <item.icon size={20} className={`mr-3 ${isActive ? 'text-white' : 'text-dark-300'}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
          
          {/* Logout button */}
          <div className="p-4 border-t border-dark-700">
            <button
              type="button"
              className="flex items-center w-full px-4 py-3 text-dark-200 rounded-md hover:bg-dark-700 transition-colors"
              onClick={onLogout}
            >
              <LogOut size={20} className="mr-3 text-dark-300" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children ?? <Outlet />}
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-dark-900 bg-opacity-70 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;