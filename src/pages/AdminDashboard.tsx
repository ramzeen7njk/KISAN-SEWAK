import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Warehouse,
  Box,
  ShoppingCart,
  Store,
  Banknote,
  Menu,
  LogOut,
  X,
  Loader2,
  Truck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { StorageFacility } from '../types/storage';
import { INDIAN_STATES, INDIAN_CITIES, type State, type City } from '../data/indianStates';
import InventoryManagement from '../components/InventoryManagement';
import CropPurchase from './CropPurchase';
import PaymentTab from './PaymentTab';
import LogisticsRequest from './LogisticsRequest';

const facilitySchema = z.object({
  name: z.string().min(1, 'Facility name is required'),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be greater than 0'),
});

type FacilityForm = z.infer<typeof facilitySchema>;

// Define regions for each state
const REGIONS = {
  North: ['Delhi', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Ladakh', 'Punjab', 'Rajasthan', 'Uttarakhand', 'Uttar Pradesh'],
  South: ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana'],
  East: ['Bihar', 'Jharkhand', 'Odisha', 'West Bengal'],
  West: ['Goa', 'Gujarat', 'Maharashtra'],
  Central: ['Chhattisgarh', 'Madhya Pradesh'],
  Northeast: ['Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura']
};

const getRegionForState = (stateName: string): string => {
  return Object.entries(REGIONS).find(([_, states]) => 
    states.includes(stateName)
  )?.[0] || '';
};

const menuItems = [
  { id: 'storage', name: 'Storage Facilities', icon: Warehouse },
  { id: 'inventory', name: 'Inventory Management', icon: Box },
  { id: 'purchase', name: 'Crop Purchase', icon: ShoppingCart },
  { id: 'orders', name: 'Marketplace Orders', icon: Store },
  { id: 'payments', name: 'Payments', icon: Banknote },
  { id: 'logistics', name: 'Logistics Requests', icon: Truck },
];

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('storage');
  const [facilities, setFacilities] = useState<StorageFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingFacilities, setIsFetchingFacilities] = useState(true);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [districts, setDistricts] = useState<City[]>([]);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FacilityForm>({
    resolver: zodResolver(facilitySchema),
  });

  const watchState = watch('state');

  useEffect(() => {
    if (watchState) {
      const state = INDIAN_STATES.find(s => s.name === watchState);
      setSelectedState(state || null);
      if (state) {
        const stateDistricts = INDIAN_CITIES.filter(city => city.stateId === state.id);
        setDistricts(stateDistricts);
        setValue('district', ''); // Reset district when state changes
      }
    }
  }, [watchState, setValue]);

  // Fetch facilities on component mount
  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      // First, let's check the table structure
      const { data: tableInfo, error: tableError } = await supabase
        .from('storage_facilities')
        .select('*')
        .limit(1);

      console.log('Table structure:', tableInfo);
      
      if (tableError) {
        throw tableError;
      }

      const { data, error } = await supabase
        .from('storage_facilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setFacilities(data || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast.error('Failed to fetch storage facilities');
    } finally {
      setIsFetchingFacilities(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('userType');
    window.location.href = '/admin/login';
  };

  const onSubmit = async (data: FacilityForm) => {
    setIsLoading(true);
    try {
      const state = INDIAN_STATES.find(s => s.name === data.state);
      const district = INDIAN_CITIES.find(c => c.name === data.district && c.stateId === state?.id);

      if (!state || !district) {
        throw new Error('Invalid state or district selected');
      }

      // Only include the fields that exist in the table
      const facilityData = {
        name: data.name,
        state: data.state,
        district: data.district,
        capacity: data.capacity,
        available_space: data.capacity,
        status: 'active' as const
      };

      console.log('Submitting facility data:', facilityData);

      const { error: insertError } = await supabase
        .from('storage_facilities')
        .insert([facilityData]);

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw new Error(insertError.message);
      }

      await fetchFacilities();
      toast.success('Storage facility created successfully');
      reset();
    } catch (error) {
      console.error('Error creating facility:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create storage facility');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
            <h1 className="text-xl font-bold text-green-700">Kisan Sewak</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, Admin</span>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <LogOut className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 256 : 0,
          x: isSidebarOpen ? 0 : -256,
        }}
        transition={{ duration: 0.2 }}
        className="fixed inset-y-0 left-0 bg-green-700 z-20 overflow-hidden"
        style={{ top: '57px' }} // Height of header
      >
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-6 py-3 text-white hover:bg-green-800 cursor-pointer transition-colors ${
                activeTab === item.id ? 'bg-green-800' : ''
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        animate={{
          marginLeft: isSidebarOpen ? 256 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="pt-16 min-h-screen"
      >
        <div className="p-6">
          {activeTab === 'storage' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Create Storage Facility Form */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Create Storage Facility</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Facility Name</label>
                      <input
                        type="text"
                        {...register('name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter facility name"
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <select
                        {...register('state')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                        disabled={isLoading}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((state) => (
                          <option key={state.id} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">District</label>
                      <select
                        {...register('district')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                        disabled={isLoading || !selectedState}
                      >
                        <option value="">Select District</option>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Region</label>
                      <input
                        type="text"
                        value={watchState ? getRegionForState(watchState) : ''}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-50"
                        disabled={true}
                        placeholder="Region will be set automatically"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Capacity (tons)
                      </label>
                      <input
                        type="number"
                        {...register('capacity', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                        disabled={isLoading}
                      />
                      {errors.capacity && (
                        <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Facility'
                    )}
                  </button>
                </form>
              </div>

              {/* Existing Facilities Table */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Storage Facilities</h3>
                {isFetchingFacilities ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                  </div>
                ) : facilities.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No storage facilities found. Create one above.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Region
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            State
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            District
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Capacity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Current Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {facilities.map((facility) => (
                          <tr key={facility.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{facility.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getRegionForState(facility.state)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{facility.state}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{facility.district}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{facility.capacity} tons</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {facility.current_stock} tons
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  facility.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {facility.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Placeholder content for other tabs */}
          {activeTab === 'inventory' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <InventoryManagement />
            </div>
          )}

          {activeTab === 'purchase' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <CropPurchase />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Marketplace Orders</h3>
              {/* Add marketplace orders content */}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <PaymentTab />
            </div>
          )}
          {activeTab === 'logistics' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <LogisticsRequest />
            </div>
          )}
        </div>
      </motion.main>
    </div>
  );
};

export default AdminDashboard;
