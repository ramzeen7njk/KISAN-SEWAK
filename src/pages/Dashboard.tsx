import React from 'react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[calc(100vh-4rem)] p-8"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <p className="text-gray-600">Dashboard content will be implemented based on user type.</p>
    </motion.div>
  );
};

export default Dashboard;