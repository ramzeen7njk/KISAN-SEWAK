import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { authService } from '../services/auth';
import { toast } from 'react-hot-toast';
import ForgotPassbook from '../components/ForgotPassbook';

const loginSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  passbook_number: z.string().length(10, 'Passbook number must be 10 digits'),
});

type LoginForm = z.infer<typeof loginSchema>;

const FarmerLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassbook, setShowForgotPassbook] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const { user, error } = await authService.farmerLogin(data.name, data.passbook_number);
      
      if (error) {
        toast.error(error);
        setIsLoading(false);
        return;
      }

      if (!user) {
        toast.error('Login failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      // Store user ID and type in localStorage
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userType', 'farmer');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('farmerName', user.name);

      toast.success('Login successful!');
      navigate('/farmer/dashboard');
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
          <Sprout className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Farmer Login</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              {...register('name')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passbook Number</label>
            <input
              {...register('passbook_number')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your 10-digit passbook number"
            />
            {errors.passbook_number && (
              <p className="mt-1 text-sm text-red-600">{errors.passbook_number.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center space-y-4">
          <button
            onClick={() => setShowForgotPassbook(true)}
            className="text-green-600 hover:text-green-700 text-sm"
          >
            Forgot Passbook Number?
          </button>
          
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/farmer/signup" className="text-green-600 hover:text-green-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {showForgotPassbook && (
        <ForgotPassbook onClose={() => setShowForgotPassbook(false)} />
      )}
    </motion.div>
  );
};

export default FarmerLogin;