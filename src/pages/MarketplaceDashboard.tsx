import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  BarChart2,
  Users,
  Package,
  Settings,
  History,
  TrendingUp,
  DollarSign,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useUser } from '../contexts/UserContext';

const sidebarItems = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: 'Overview',
    path: '/marketplace/dashboard'
  },
  {
    icon: <Store className="w-5 h-5" />,
    label: 'Products',
    path: '/marketplace/products'
  },
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    label: 'Orders',
    path: '/marketplace/orders'
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    label: 'Analytics',
    path: '/marketplace/analytics'
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: 'Customers',
    path: '/marketplace/customers'
  },
  {
    icon: <Package className="w-5 h-5" />,
    label: 'Inventory',
    path: '/marketplace/inventory'
  },
  {
    icon: <History className="w-5 h-5" />,
    label: 'History',
    path: '/marketplace/history'
  }
];

const StatCard = ({ title, value, icon: Icon, trend, color }: { title: string; value: string; icon: any; trend?: string; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {trend && (
          <p className="text-sm text-green-600 mt-1">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const RecentActivity = ({ activities }: { activities: Array<{ type: string; description: string; time: string }> }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm p-6"
  >
    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
          <div>
            <p className="text-sm font-medium">{activity.description}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const MarketplaceDashboard = () => {
  const { user } = useUser();
  const companyName = user?.user_metadata?.company_name || 'Your Company';

  const stats = [
    {
      title: 'Total Revenue',
      value: '₹45,231',
      icon: DollarSign,
      trend: '+20.1% from last month',
      color: 'bg-green-500'
    },
    {
      title: 'Active Orders',
      value: '12',
      icon: ShoppingCart,
      trend: '+2 new orders',
      color: 'bg-blue-500'
    },
    {
      title: 'Products in Stock',
      value: '156',
      icon: PackageCheck,
      trend: 'Updated 2h ago',
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Tasks',
      value: '3',
      icon: AlertCircle,
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    {
      type: 'order',
      description: 'New order #1234 received from Farmer John',
      time: '2 hours ago'
    },
    {
      type: 'payment',
      description: 'Payment received for order #1233',
      time: '4 hours ago'
    },
    {
      type: 'inventory',
      description: 'Stock updated for Wheat (1000 kg)',
      time: '6 hours ago'
    },
    {
      type: 'verification',
      description: 'New farmer verification request',
      time: '1 day ago'
    }
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userType="marketplace"
      userName={companyName}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {companyName}!</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Last updated:</span>
            <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activities={recentActivities} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Package className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-sm font-medium">Add New Product</p>
              </button>
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <ShoppingCart className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-sm font-medium">View Orders</p>
              </button>
              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Users className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-sm font-medium">Manage Customers</p>
              </button>
              <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <Settings className="w-6 h-6 text-orange-600 mb-2" />
                <p className="text-sm font-medium">Settings</p>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarketplaceDashboard; 