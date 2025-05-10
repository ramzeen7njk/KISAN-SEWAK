import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../services/auth';

const loginSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  license_number: z.string().min(1, 'License number is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LogisticsLogin = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({    
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const { user: logistics, error } = await authService.logisticsLogin(
        data.company_name.trim(),
        data.license_number.trim()
      );

      if (error) {
        toast.error(error);
        return;
      }

      localStorage.setItem('userType', 'logistics');
      localStorage.setItem('isLogisticsLoggedIn', 'true');
      localStorage.setItem('logisticsId', logistics.id);
      
      toast.success('Login successful!');
      navigate('/logistics/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
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
          <Truck className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Logistics Login</h2>
        
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
            <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
            <input
              {...register('license_number')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter license number"
            />
            {errors.license_number && (
              <p className="mt-1 text-sm text-red-600">{errors.license_number.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/logistics/signup" className="text-green-600 hover:text-green-700">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LogisticsLogin;