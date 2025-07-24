import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, path: "." },
    { name: "Create Job", icon: BriefcaseBusiness, path: "create-job" },
    { name: "Manage Jobs", icon: ClipboardList, path: "manage-jobs" },
    { name: "Talent Bank", icon: Users, path: "talent-bank" },
    { name: "Reports", icon: BarChart3, path: "reports" },
    { name: "Settings", icon: Settings, path: "settings" },
    { name: "Criar Formulário", icon: ClipboardList, path: "create-form" },
    { name: "Meus Formulários", icon: ClipboardList, path: "forms" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/loginRH";
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <div className="flex h-screen bg-dark-900">
        {/* Mobile sidebar toggle */}
        <button
          type="button"
          className="lg:hidden fixed z-50 top-4 left-4 p-2 rounded-md bg-gradient-primary text-white shadow-lg"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-dark-800 border-r border-dark-700 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-screen">
            {/* Logo */}
            <div className="flex-shrink-0 p-4 border-b border-dark-700">
              <div className="flex items-center">
                <span className="text-xl font-bold gradient-text">
                  TalentLink
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-600 scrollbar-track-dark-800">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive
                        ? "bg-gradient-primary text-white"
                        : "text-dark-200 hover:bg-dark-700"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={`mr-3 ${
                        isActive ? "text-white" : "text-dark-300"
                      }`}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Logout button */}
            <div className="flex-shrink-0 p-4 border-t border-dark-700">
              <button
                type="button"
                className="flex items-center w-full px-4 py-3 text-dark-200 rounded-md hover:bg-dark-700 transition-colors"
                onClick={() => setShowLogoutModal(true)}
              >
                <LogOut size={20} className="mr-3 text-dark-300" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0 lg:ml-0">
          {/* Header for mobile */}
          <div className="lg:hidden bg-dark-800 border-b border-dark-700 p-4 pl-16">
            <span className="text-lg font-semibold text-white">Dashboard</span>
          </div>
          
          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-dark-900 p-4 md:p-6 lg:p-8">
            {children ?? <Outlet />}
          </main>
        </div>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">
              Deseja sair?
            </h2>
            <p className="text-dark-200 mb-6">
              Você será redirecionado para a tela de login.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 rounded-md bg-dark-700 text-white hover:bg-dark-600 transition-colors"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded-md bg-pink-600 text-white hover:bg-pink-500 transition-colors"
                onClick={handleLogout}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardLayout;
