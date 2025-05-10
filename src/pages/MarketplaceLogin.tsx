import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { authService } from '../services/auth';
import { toast } from 'react-hot-toast';
import { supabase } from '../config/supabase';

const loginSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  company_type: z.enum(['ration', 'corporation', 'restaurant', 'hotel', 'wholesale', 'retail', 'contract']),
  iso_number: z.string().length(8, 'ISO number must be 8 digits'),
});

type LoginForm = z.infer<typeof loginSchema>;

const MarketplaceLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      
      // Search for the marketplace profile
      const { data: marketplaceData, error: searchError } = await supabase
        .from('marketplaces')
        .select('*')
        .eq('company_name', data.company_name)
        .eq('company_type', data.company_type)
        .eq('iso_number', data.iso_number)
        .single();

      if (searchError) {
        console.error('Database error during marketplace login:', searchError);
        toast.error('Database error occurred. Please try again.');
        return;
      }

      if (!marketplaceData) {
        toast.error('Invalid credentials. Please check your details and try again.');
        return;
      }

      // Create a session object for marketplace users
      const session = {
        user: {
          id: marketplaceData.id,
          user_metadata: {
            user_type: 'marketplace',
            company_name: marketplaceData.company_name,
            company_type: marketplaceData.company_type,
            iso_number: marketplaceData.iso_number,
            verification_status: marketplaceData.verification_status
          }
        }
      };

      // Store the session in localStorage
      localStorage.setItem('marketplace_session', JSON.stringify(session));
      localStorage.setItem('userId', marketplaceData.id);
      localStorage.setItem('userType', 'marketplace');
      localStorage.setItem('isLoggedIn', 'true');

      toast.success('Login successful!');
      navigate('/marketplace/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4"
    >
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-8">
          <Building2 className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Marketplace Login</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              {...register('company_name')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter company name"
            />
            {errors.company_name && (
              <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
            <select
              {...register('company_type')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select company type</option>
              <option value="ration">Ration</option>
              <option value="corporation">Corporation</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel</option>
              <option value="wholesale">Wholesale Market</option>
              <option value="retail">Retail</option>
              <option value="contract">Contract</option>
            </select>
            {errors.company_type && (
              <p className="mt-1 text-sm text-red-600">{errors.company_type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ISO Number</label>
            <input
              {...register('iso_number')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter 8-digit ISO number"
            />
            {errors.iso_number && (
              <p className="mt-1 text-sm text-red-600">{errors.iso_number.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/marketplace/signup" className="text-green-600 hover:text-green-700">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default MarketplaceLogin;