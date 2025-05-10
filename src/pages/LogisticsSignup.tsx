import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import TermsAndConditions from '../components/TermsAndConditions';
import StateRegionSelect from '../components/StateRegionSelect';
import BankSelect from '../components/BankSelect';
import { authService } from '../services/auth';
import { toast } from 'react-hot-toast';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(18, 'Must be at least 18 years old'),
  company_name: z.string().min(1, 'Company name is required'),
  logistics_type: z.enum(['truck', 'van', 'mini_truck', 'tempo']),
  mobile: z.string().length(10, 'Mobile number must be 10 digits'),
  quantity_available: z.number().positive('Quantity must be positive'),
  license_number: z.string().length(10, 'License number must be 10 digits'),
  state: z.string().min(1, 'State is required'),
  region: z.string().min(1, 'Region is required'),
  bank_name: z.string().min(1, 'Bank name is required'),
  bank_account: z.string().min(1, 'Bank account number is required'),
  ifsc_code: z.string().length(11, 'IFSC code must be 11 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  terms_accepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
});

type SignupForm = z.infer<typeof signupSchema>;

const LogisticsSignup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });
  const [showTerms, setShowTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true);

      const { error: authError, message } = await authService.signup({
        email: data.email,
        password: data.password,
        userType: 'logistics',
        userData: {
          name: data.name,
          age: data.age,
          company_name: data.company_name,
          logistics_type: data.logistics_type,
          mobile: data.mobile,
          quantity_available: data.quantity_available,
          license_number: data.license_number,
          state: data.state,
          region: data.region,
          bank_name: data.bank_name,
          bank_account: data.bank_account,
          ifsc_code: data.ifsc_code,
        },
      });

      if (authError) throw authError;

      toast.success(message || 'Registration successful!');
      navigate('/logistics/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStateChange = (state: string) => {
    setValue('state', state);
  };

  const handleRegionChange = (region: string) => {
    setValue('region', region);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4"
    >
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full my-8">
        <div className="flex items-center justify-center mb-8">
          <Truck className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Logistics Registration</h2>
        
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              {...register('age', { valueAsNumber: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your age"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Logistics Type</label>
            <select
              {...register('logistics_type')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select logistics type</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="mini_truck">Mini Truck</option>
              <option value="tempo">Tempo</option>
            </select>
            {errors.logistics_type && (
              <p className="mt-1 text-sm text-red-600">{errors.logistics_type.message}</p>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Available</label>
            <input
              type="number"
              {...register('quantity_available', { valueAsNumber: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter available quantity"
            />
            {errors.quantity_available && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity_available.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
            <input
              {...register('license_number')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter 10-digit license number"
            />
            {errors.license_number && (
              <p className="mt-1 text-sm text-red-600">{errors.license_number.message}</p>
            )}
          </div>

          <StateRegionSelect
            onStateChange={handleStateChange}
            onRegionChange={handleRegionChange}
            stateError={errors.state?.message}
            regionError={errors.region?.message}
          />

          <BankSelect
            onBankChange={({ name, ifscPrefix }) => {
              setValue('bank_name', name);
              setValue('ifsc_code', ifscPrefix);
            }}
            bankError={errors.bank_name?.message}
            ifscError={errors.ifsc_code?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number</label>
            <input
              {...register('bank_account')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your bank account number"
            />
            {errors.bank_account && (
              <p className="mt-1 text-sm text-red-600">{errors.bank_account.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your password (min 6 characters)"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('terms_accepted')}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                I accept the terms and conditions
              </label>
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="ml-2 text-sm text-green-600 hover:text-green-700 underline"
              >
                View T&C
              </button>
            </div>
            {errors.terms_accepted && (
              <p className="text-sm text-red-600">{errors.terms_accepted.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/logistics/login" className="text-green-600 hover:text-green-700">
            Login
          </Link>
        </p>
      </div>

      {showTerms && <TermsAndConditions onClose={() => setShowTerms(false)} />}
    </motion.div>
  );
};

export default LogisticsSignup;