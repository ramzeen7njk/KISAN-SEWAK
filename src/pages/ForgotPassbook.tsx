import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { authService } from '../services/auth';
import { toast } from 'react-hot-toast';
import PassbookModal from '../components/PassbookModal';

const forgotPassbookSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  mobile: z.string().length(10, 'Mobile number must be 10 digits'),
});

type ForgotPassbookForm = z.infer<typeof forgotPassbookSchema>;

const ForgotPassbook = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPassbookForm>({
    resolver: zodResolver(forgotPassbookSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassbook, setShowPassbook] = useState(false);
  const [passbookNumber, setPassbookNumber] = useState<string>('');

  const onSubmit = async (data: ForgotPassbookForm) => {
    try {
      setIsLoading(true);
      const { passbookNumber: retrievedPassbook, error } = await authService.retrievePassbookNumber(
        data.name,
        data.mobile
      );

      if (error) throw error;
      if (retrievedPassbook) {
        setPassbookNumber(retrievedPassbook);
        setShowPassbook(true);
      }
    } catch (error: any) {
      console.error('Passbook retrieval error:', error);
      toast.error(error.message || 'Failed to retrieve passbook number. Please try again.');
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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Retrieve Passbook Number</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              {...register('name')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              {...register('mobile')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your 10-digit mobile number"
            />
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
          >
            {isLoading ? 'Retrieving...' : 'Retrieve Passbook Number'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your passbook number?{' '}
          <Link to="/farmer/login" className="text-green-600 hover:text-green-700">
            Login here
          </Link>
        </p>
      </div>

      {/* Passbook Modal */}
      {showPassbook && (
        <PassbookModal
          passbookNumber={passbookNumber}
          onClose={() => setShowPassbook(false)}
        />
      )}
    </motion.div>
  );
};

export default ForgotPassbook; 