import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../services/auth';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

const forgotPassbookSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  mobile: z.string().length(10, 'Mobile number must be 10 digits'),
});

type ForgotPassbookForm = z.infer<typeof forgotPassbookSchema>;

interface ForgotPassbookProps {
  onClose: () => void;
}

const ForgotPassbook: React.FC<ForgotPassbookProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [passbookNumber, setPassbookNumber] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPassbookForm>({
    resolver: zodResolver(forgotPassbookSchema),
  });

  const onSubmit = async (data: ForgotPassbookForm) => {
    try {
      setIsLoading(true);
      const { passbookNumber: retrievedPassbook, error } = await authService.retrievePassbookNumber(data.name, data.mobile);
      
      if (error) throw error;
      
      setPassbookNumber(retrievedPassbook);
    } catch (error: any) {
      console.error('Passbook retrieval error:', error);
      toast.error(error.message || 'Failed to retrieve passbook number. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Retrieve Passbook Number
        </h2>

        {passbookNumber ? (
          <div className="text-center space-y-4">
            <p className="text-gray-700">Your Passbook Number is:</p>
            <p className="text-2xl font-bold text-green-600">{passbookNumber}</p>
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
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
        )}
      </div>
    </div>
  );
};

export default ForgotPassbook; 