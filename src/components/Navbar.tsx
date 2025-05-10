import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Sprout className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-green-800">Kisan Sewak</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/farmer/login"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Farmer
            </Link>
            <Link 
              to="/marketplace/login"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Marketplace
            </Link>
            <Link 
              to="/logistics/login"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Logistics
            </Link>
            <Link 
              to="/admin/login"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;