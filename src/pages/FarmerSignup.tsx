import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { authService } from '../services/auth';
import { toast } from 'react-hot-toast';
import StateRegionSelect from '../components/StateRegionSelect';
import TermsAndConditions from '../components/TermsAndConditions';
import PassbookModal from '../components/PassbookModal';
import CropSelect from '../components/CropSelect';
import AadharInput from '../components/AadharInput';
import { INDIAN_STATES, INDIAN_CITIES } from '../data/indianStates';
import BankSelect from '../components/BankSelect';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(18, 'Must be at least 18 years old'),
  mobile: z.string().length(10, 'Mobile number must be 10 digits'),
  aadhar_number: z.string()
    .min(14, 'Aadhar number must be 12 digits')
    .max(14, 'Aadhar number must be 12 digits')
    .refine((val) => val.replace(/-/g, '').length === 12, 'Aadhar number must be 12 digits'),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  region: z.string().min(1, 'Region is required'),
  crops_cultivated: z.string().min(1, 'Crops cultivated is required'),
  land_acres: z.number().positive('Land area must be positive'),
  bank_name: z.string().min(1, 'Bank name is required'),
  bank_account: z.string().min(1, 'Bank account number is required'),
  ifsc_code: z.string().length(11, 'IFSC code must be 11 characters'),
  terms_accepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
});

type SignupForm = z.infer<typeof signupSchema>;

const FarmerSignup = () => {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [showPassbook, setShowPassbook] = useState(false);
  const [passbookNumber, setPassbookNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [districts, setDistricts] = useState<{ id: string; name: string; }[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const watchState = watch('state');

  useEffect(() => {
    if (watchState) {
      const state = INDIAN_STATES.find(s => s.name === watchState);
      if (state) {
        const stateDistricts = INDIAN_CITIES.filter(city => city.stateId === state.id);
        setDistricts(stateDistricts);
        setValue('district', ''); // Reset district when state changes
      }
    }
  }, [watchState, setValue]);

  const onSubmit = async (data: SignupForm) => {
    if (!data.bank_name || !data.bank_account || !data.ifsc_code) {
      toast.error('Please fill in all bank details');
      return;
    }
    try {
      setIsLoading(true);
      
      // Remove hyphens from aadhar number before sending
      const cleanedData = {
        ...data,
        aadhar_number: data.aadhar_number.replace(/-/g, ''),
        // Convert crops_cultivated to array if it's a string
        crops_cultivated: Array.isArray(data.crops_cultivated) 
          ? data.crops_cultivated 
          : data.crops_cultivated.split(',').map(crop => crop.trim())
      };

      const { error, passbookNumber: generatedPassbook, message } = await authService.signup({
        userType: 'farmer',
        userData: {
          name: cleanedData.name,
          age: cleanedData.age,
          mobile: cleanedData.mobile,
          aadhar_number: cleanedData.aadhar_number,
          state: cleanedData.state,
          district: cleanedData.district,
          region: cleanedData.region,
          crops_cultivated: cleanedData.crops_cultivated,
          land_acres: cleanedData.land_acres,
          bank_name: cleanedData.bank_name,
          bank_account: cleanedData.bank_account,
          ifsc_code: cleanedData.ifsc_code,
        }
      });

      if (error) throw error;

      toast.success(message || 'Registration successful!');
      if (generatedPassbook) {
        setPassbookNumber(generatedPassbook);
        setShowPassbook(true);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassbookClose = () => {
    setShowPassbook(false);
    navigate('/farmer/login');
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
          <Sprout className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Farmer Registration</h2>
        
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

          <AadharInput 
            register={register} 
            error={errors.aadhar_number?.message}
          />

          <StateRegionSelect
            onStateChange={handleStateChange}
            onRegionChange={handleRegionChange}
            stateError={errors.state?.message}
            regionError={errors.region?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <select
              {...register('district')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={!watchState}
            >
              <option value="">Select your district</option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
            )}
          </div>

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

          <CropSelect
            onCropChange={(crops) => setValue('crops_cultivated', crops.join(', '))}
            error={errors.crops_cultivated?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Land Area (in acres)</label>
            <input
              type="number"
              step="0.01"
              {...register('land_acres', { valueAsNumber: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter land area in acres"
            />
            {errors.land_acres && (
              <p className="mt-1 text-sm text-red-600">{errors.land_acres.message}</p>
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
          <Link to="/farmer/login" className="text-green-600 hover:text-green-700">
            Login
          </Link>
        </p>
      </div>

      {showTerms && <TermsAndConditions onClose={() => setShowTerms(false)} />}
      {showPassbook && (
        <PassbookModal
          passbookNumber={passbookNumber}
          onClose={handlePassbookClose}
        />
      )}
    </motion.div>
  );
};

export default FarmerSignup;