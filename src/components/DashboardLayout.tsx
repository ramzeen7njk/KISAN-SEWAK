import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User, LogOut, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItem {
  icon: ReactNode;
  label: string;
  path?: string;
  onClick?: () => void;
}

interface DashboardLayoutProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
  userType: string;
  userName: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebarItems,
  userType,
  userName,
}) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleItemClick = (item: SidebarItem) => {
    if (item.onClick) {
      item.onClick();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-y-0 left-0 bg-white shadow-md max-h-screen w-60 z-20"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex-grow">
                <div className="p-4 pb-2 flex justify-between items-center">
                  <h1 className="text-xl font-semibold text-gray-800">Kisan Sewak</h1>
                  <button 
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="p-4">
                  <h2 className="text-xs uppercase text-gray-600 font-semibold">Menu</h2>
                  <nav className="mt-4 space-y-2">
                    {sidebarItems.map((item, index) => {
                      const isActive = item.path ? location.pathname === item.path : false;
                      const content = (
                        <div
                          className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                            isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                      );

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {item.path ? (
                            <Link to={item.path}>{content}</Link>
                          ) : (
                            <div
                              onClick={() => handleItemClick(item)}
                              className="cursor-pointer"
                            >
                              {content}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </nav>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center space-x-2 border-t pt-4">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700">{userName}</div>
                    <div className="text-xs text-gray-500 capitalize">{userType}</div>
                  </div>
                  <Link
                    to="/logout"
                    className="p-2 ml-auto rounded-lg hover:bg-gray-100"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 text-gray-600" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle Button for Closed Sidebar */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 z-20"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Main Content */}
      <main className={`transition-all duration-200 ${isSidebarOpen ? 'ml-60' : 'ml-0'} p-8`}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;