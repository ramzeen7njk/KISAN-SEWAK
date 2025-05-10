import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  Truck,
  Store,
  FileText,
  History,
  AlertCircle,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../config/supabase';
import DashboardLayout from '../components/DashboardLayout';
import type { StorageFacility } from '../types/storage';
import type { FarmerData } from '../types/farmer';
import { PieChart } from 'react-minimal-pie-chart';
import SellCrops from './SellCrops';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [storageFacilities, setStorageFacilities] = useState<StorageFacility[]>([]);
  const [allStorageFacilities, setAllStorageFacilities] = useState<StorageFacility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [farmerData, setFarmerData] = useState<any>(null);
  const [showDistrictUpdate, setShowDistrictUpdate] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [cropAllocations, setCropAllocations] = useState<any[]>([]);
  const [showCropsContent, setShowCropsContent] = useState('overview');
  const [searchDistrict, setSearchDistrict] = useState('');

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Overview',
      onClick: () => setShowCropsContent('overview')
    },
    {
      icon: <Sprout className="w-5 h-5" />,
      label: 'My Crops',
      onClick: () => setShowCropsContent('crops')
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Market Prices',
      path: '/farmer/market-prices'
    },
    {
      icon: <Truck className="w-5 h-5" />,
      label: 'Logistics',
      path: '/farmer/logistics'
    },
    {
      icon: <Store className="w-5 h-5" />,
      label: 'Sell Crops',
      onClick: () => setShowCropsContent('sell')
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Documents',
      path: '/farmer/documents'
    },
    {
      icon: <History className="w-5 h-5" />,
      label: 'History',
      path: '/farmer/history'
    }
  ];

  // Load crop allocations
  const loadCropAllocations = async () => {
    try {
      const farmerId = localStorage.getItem('userId');
      const { data, error } = await supabase
        .from('crop_allocations')
        .select('*')
        .eq('farmer_id', farmerId);

      if (error) throw error;
      setCropAllocations(data || []);
    } catch (error) {
      console.error('Error loading crop allocations:', error);
      toast.error('Failed to load crop allocations');
    }
  };

  // Load available districts from storage facilities
  const loadAvailableDistricts = async () => {
    try {
      const { data: facilities, error } = await supabase
        .from('storage_facilities')
        .select('district')
        .eq('status', 'active');

      if (error) throw error;
      const districts = [...new Set(facilities?.map(f => f.district) || [])].sort();
      setAvailableDistricts(districts);
    } catch (error) {
      console.error('Error loading districts:', error);
    }
  };

  // Load all storage facilities
  const loadAllStorageFacilities = async () => {
    try {
      const { data: facilities, error } = await supabase
        .from('storage_facilities')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      setAllStorageFacilities(facilities || []);
      setStorageFacilities(facilities || []);
    } catch (error) {
      console.error('Error loading facilities:', error);
    }
  };

  // Load farmer data and facilities
  const loadFarmerAndFacilities = async () => {
    try {
      setIsLoading(true);
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const farmerId = localStorage.getItem('userId');
      const userType = localStorage.getItem('userType');

      if (!isLoggedIn || !farmerId || userType !== 'farmer') {
        console.log('Not logged in, redirecting to login');
        navigate('/farmer/login');
        return;
      }

      // Get farmer's details
      const { data: farmer, error: farmerError } = await supabase
        .from('farmers')
        .select('id, name, selected_district, crops_cultivated, land_acres')
        .eq('id', farmerId)
        .single();

      console.log('Farmer data:', farmer);

      if (farmerError) {
        console.error('Error fetching farmer:', farmerError);
        setError('Failed to fetch farmer profile');
        return;
      }

      if (!farmer) {
        setError('Farmer profile not found');
        return;
      }

      setFarmerData(farmer);

      // Show district update dialog if district is not set or not in available districts
      if (!farmer.selected_district || !availableDistricts.includes(farmer.selected_district)) {
        setShowDistrictUpdate(true);
        return;
      }

      // Get all facilities in farmer's district
      const { data: facilities, error: facilitiesError } = await supabase
        .from('storage_facilities')
        .select('*')
        .eq('status', 'active')
        .eq('district', farmer.selected_district);

      if (facilitiesError) {
        console.error('Error fetching facilities:', facilitiesError);
        setError('Failed to fetch storage facilities');
        return;
      }

      setStorageFacilities(facilities || []);
      setShowDistrictUpdate(false);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter facilities by district
  const handleDistrictSearch = (searchTerm: string) => {
    setSearchDistrict(searchTerm);
    if (!searchTerm.trim()) {
      setStorageFacilities(allStorageFacilities);
      return;
    }
    
    const filteredFacilities = allStorageFacilities.filter(facility =>
      facility.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setStorageFacilities(filteredFacilities);
  };

  const updateDistrict = async () => {
    if (!selectedDistrict) {
      toast.error('Please select a district');
      return;
    }

    const farmerId = localStorage.getItem('userId');
    if (!farmerId) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('farmers')
        .update({ selected_district: selectedDistrict })
        .eq('id', farmerId);

      if (error) throw error;

      // Update local state
      setFarmerData((prev: FarmerData) => ({ ...prev, selected_district: selectedDistrict }));
      
      // Fetch facilities for the new district
      const { data: facilities, error: facilitiesError } = await supabase
        .from('storage_facilities')
        .select('*')
        .eq('status', 'active')
        .eq('district', selectedDistrict);

      if (facilitiesError) throw facilitiesError;

      setStorageFacilities(facilities || []);
      setShowDistrictUpdate(false);
      toast.success('District updated successfully');
    } catch (error: any) {
      console.error('Error updating district:', error);
      toast.error('Failed to update district. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStorageRequest = async (facilityId: string) => {
    const farmerId = localStorage.getItem('userId');
    if (!farmerId) {
      toast.error('Please log in to request storage');
      return;
    }

    try {
      const { error } = await supabase
        .from('storage_requests')
        .insert([
          {
            farmer_id: farmerId,
            facility_id: facilityId,
            status: 'pending'
          }
        ]);

      if (error) throw error;
      toast.success('Storage request submitted successfully');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit storage request');
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      await loadAvailableDistricts();
      await loadAllStorageFacilities();
      await loadFarmerAndFacilities(); // Load farmer data first
      await loadCropAllocations(); // Then load crop allocations
    };

    init();
  }, []);

  // New function to handle harvesting
  const handleHarvest = async (allocationId: string, harvestQuantity: number) => {
    try {
      const harvestDate = new Date();
      // Initialize expiryDate with a default value
      let expiryDate = new Date(harvestDate);
      expiryDate.setDate(expiryDate.getDate() + 7); // Default: 1 week for other crops

      // Determine expiry date based on crop type
      const crop = cropAllocations.find(c => c.id === allocationId);
      if (crop) {
        switch (crop.crop_name.toLowerCase()) {
          case 'wheat':
            expiryDate = new Date(harvestDate);
            expiryDate.setMonth(expiryDate.getMonth() + 3); // 3 months for wheat
            break;
          case 'rice':
            expiryDate = new Date(harvestDate);
            expiryDate.setMonth(expiryDate.getMonth() + 2); // 2 months for rice
            break;
        }
      }

      const { error } = await supabase
        .from('crop_allocations')
        .update({
          status: 'harvested',
          harvest_quantity: harvestQuantity,
          harvest_date: harvestDate.toISOString(),
          expiry_date: expiryDate.toISOString(),
          is_area_free: true
        })
        .eq('id', allocationId);

      if (error) throw error;
      toast.success('Harvest recorded successfully');
      loadCropAllocations();
    } catch (error) {
      console.error('Error recording harvest:', error);
      toast.error('Failed to record harvest');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate remaining days until expiry
  const getRemainingDays = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // New function to handle crop allocation
  const handleCropAllocation = async (cropName: string, acres: number) => {
    try {
      const farmerId = localStorage.getItem('userId');
      if (!farmerId) {
        toast.error('Please log in to allocate crops');
        return;
      }

      const { error } = await supabase
        .from('crop_allocations')
        .insert([
          {
            farmer_id: farmerId,
            crop_name: cropName,
            allocated_acres: acres,
            status: 'allocated'
          }
        ]);

      if (error) throw error;
      toast.success('Crop allocated successfully');
      loadCropAllocations();
    } catch (error) {
      console.error('Error allocating crop:', error);
      toast.error('Failed to allocate crop');
    }
  };

  // Helper function to parse crops cultivated data
  const parseCropsCultivated = (crops: any): string[] => {
    if (!crops) return [];
    if (Array.isArray(crops)) return crops;
    try {
      // Try parsing if it's a JSON string
      const parsed = JSON.parse(crops);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // If it's a comma-separated string, split it
      return typeof crops === 'string' ? crops.split(',').map(crop => crop.trim()) : [];
    }
  };

  // Add these variables back before the renderMyCropsContent function
  const stats = [
    { label: 'Total Crops', value: '4', change: '+1 this month' },
    { label: 'Active Orders', value: '12', change: '+3 this week' },
    { label: 'Revenue', value: '₹45,000', change: '+12% this month' },
    { label: 'Land Usage', value: '85%', change: '+5% from last season' },
  ];

  const recentActivities = [
    { id: 1, type: 'order', message: 'New order received for Rice', time: '2 hours ago' },
    { id: 2, type: 'price', message: 'Market price for Wheat increased', time: '5 hours ago' },
    { id: 3, type: 'logistics', message: 'Shipment #123 delivered successfully', time: '1 day ago' },
  ];

  const weatherData = {
    temperature: '28°C',
    condition: 'Partly Cloudy',
    humidity: '65%',
    rainfall: '60%'
  };

  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);

  const aiSuggestions = [
    { crop: 'Wheat', suggestion: 'Suitable for current climate conditions', details: 'Wheat is a versatile crop that can be grown in various climates. It is recommended to use high-yield varieties and ensure proper irrigation.' },
    { crop: 'Rice', suggestion: 'Consider mixed farming with legumes', details: 'Rice can benefit from mixed farming with legumes, which can improve soil fertility and reduce pest issues. Consider using organic fertilizers.' },
  ];

  // Parse crops_cultivated from farmer data using the helper function
  const selectedCrops = parseCropsCultivated(farmerData?.crops_cultivated);

  // Render My Crops content
  const renderMyCropsContent = () => {
    if (!farmerData) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading farmer data...</p>
        </div>
      );
    }

    console.log('Farmer Data:', farmerData); // Debug log

    const totalLand = farmerData.land_acres || 0;
    const allocatedLand = cropAllocations
      .filter(crop => !crop.is_area_free)
      .reduce((sum, crop) => sum + crop.allocated_acres, 0);
    const remainingLand = totalLand - allocatedLand;

    const pieChartData = cropAllocations
      .filter(crop => !crop.is_area_free)
      .map((crop, index) => ({
        title: crop.crop_name,
        value: crop.allocated_acres,
        color: `hsl(${index * 50}, 70%, 50%)`
      }));

    // Separate active and harvested crops
    const activeCrops = cropAllocations.filter(crop => !crop.is_area_free);
    const harvestedCrops = cropAllocations.filter(crop => crop.is_area_free);

    console.log('Selected Crops:', selectedCrops); // Debug log

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">My Crops Overview</h2>
          
          {/* Land Usage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Total Land</h3>
              <p className="text-2xl font-semibold text-gray-800">{totalLand} acres</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Allocated</h3>
              <p className="text-2xl font-semibold text-gray-800">{allocatedLand} acres</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600">Remaining</h3>
              <p className="text-2xl font-semibold text-gray-800">{remainingLand} acres</p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="h-64 mb-6">
            {pieChartData.length > 0 ? (
              <PieChart
                data={pieChartData}
                label={({ dataEntry }) => `${dataEntry.title} (${Math.round(dataEntry.value)}ac)`}
                labelStyle={{ fontSize: '5px' }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No crops allocated yet
              </div>
            )}
          </div>

          {/* Crop Allocations List */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700">Current Allocations</h3>
            {activeCrops.map((crop) => (
              <div key={crop.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{crop.crop_name}</h4>
                    <p className="text-sm text-gray-600">{crop.allocated_acres} acres</p>
                  </div>
                  {crop.status === 'allocated' && (
                    <button
                      onClick={() => {
                        const quantity = prompt('Enter harvest quantity (in kg):');
                        if (quantity) {
                          handleHarvest(crop.id, parseFloat(quantity));
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Record Harvest
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Harvested Crops History */}
          <div className="mt-8">
            <h3 className="text-md font-medium text-gray-700 mb-4">Harvest History</h3>
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harvest Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {harvestedCrops.map((crop) => {
                    const remainingDays = getRemainingDays(crop.expiry_date);
                    return (
                      <tr key={crop.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {crop.crop_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {crop.harvest_quantity} kg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(crop.harvest_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(crop.expiry_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            remainingDays > 30 
                              ? 'bg-green-100 text-green-800'
                              : remainingDays > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {remainingDays > 0 
                              ? `${remainingDays} days left`
                              : 'Expired'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Allocation Form */}
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="text-md font-medium text-gray-700 mb-4">Allocate New Crop</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const cropName = (form.elements.namedItem('cropName') as HTMLSelectElement).value;
              const acres = parseFloat((form.elements.namedItem('acres') as HTMLInputElement).value);
              handleCropAllocation(cropName, acres);
              form.reset();
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="cropName"
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a crop</option>
                  {selectedCrops.map((crop: string) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="acres"
                  placeholder="Acres"
                  required
                  min="1"
                  max={remainingLand}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                disabled={remainingLand <= 0 || selectedCrops.length === 0}
                className={`mt-4 w-full px-4 py-2 rounded ${
                  remainingLand <= 0 || selectedCrops.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {remainingLand <= 0 
                  ? 'No Land Available' 
                  : selectedCrops.length === 0 
                    ? 'No Crops Selected' 
                    : 'Allocate Crop'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Render main dashboard content
  const renderDashboardContent = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-2">{stat.value}</p>
            <p className="text-sm text-green-600 mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Weather Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Weather Forecast</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Temperature</span>
              <span className="font-medium">{weatherData.temperature}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Condition</span>
              <span className="font-medium">{weatherData.condition}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Humidity</span>
              <span className="font-medium">{weatherData.humidity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Chance of Rain</span>
              <span className="font-medium">{weatherData.rainfall}</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Storage Facilities */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Storage Facilities
            {farmerData?.selected_district && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                (in {farmerData.selected_district})
              </span>
            )}
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by district..."
              value={searchDistrict}
              onChange={(e) => handleDistrictSearch(e.target.value)}
              className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {showDistrictUpdate ? (
          <div className="p-4 border rounded-lg mb-4">
            <h3 className="font-medium mb-2">Please select your district</h3>
            <p className="text-sm text-gray-600 mb-4">
              Only districts with available storage facilities are shown
            </p>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Select a district</option>
              {availableDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <button
              onClick={updateDistrict}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Update District
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            <p>{error}</p>
          </div>
        ) : storageFacilities.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No storage facilities available in {farmerData?.selected_district || 'your district'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {storageFacilities.map((facility) => (
              <div key={facility.id} className="border p-4 rounded-lg hover:bg-gray-50">
                <h3 className="font-medium">{facility.name}</h3>
                <p className="text-sm text-gray-600">Location: {facility.district}, {facility.state}</p>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Total Capacity: {facility.capacity} tons
                  </p>
                  <p className="text-sm text-gray-600">
                    Available Space: {facility.capacity - (facility.current_stock || 0)} tons
                  </p>
                </div>
                <button
                  onClick={() => handleStorageRequest(facility.id)}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Request Storage
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 bg-white p-6 rounded-xl shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">AI Crop Suggestions</h2>
        <div className="space-y-4">
          {aiSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              onClick={() => setSelectedSuggestion(index)}
            >
              <Sprout className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700">{suggestion.crop}</p>
                <p className="text-xs text-gray-500">{suggestion.suggestion}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedSuggestion !== null && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">Details</h3>
            <p className="text-sm text-gray-600 mt-2">{aiSuggestions[selectedSuggestion].details}</p>
            <button
              onClick={() => setSelectedSuggestion(null)}
              className="mt-2 text-sm text-green-600 hover:text-green-700"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 bg-white p-6 rounded-xl shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Store className="w-6 h-6 text-green-600 mx-auto" />
            <span className="block text-sm font-medium text-gray-700 mt-2">Sell Crops</span>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <TrendingUp className="w-6 h-6 text-purple-600 mx-auto" />
            <span className="block text-sm font-medium text-gray-700 mt-2">View Prices</span>
          </button>
          <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <Settings className="w-6 h-6 text-orange-600 mx-auto" />
            <span className="block text-sm font-medium text-gray-700 mt-2">Settings</span>
          </button>
        </div>
      </motion.div>

      <SellCrops />
    </>
  );

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userType="farmer"
      userName={farmerData?.name || "Farmer"}
    >
      {showCropsContent === 'sell' ? (
        <SellCrops />
      ) : showCropsContent === 'crops' ? (
        renderMyCropsContent()
      ) : (
        renderDashboardContent()
      )}
    </DashboardLayout>
  );
};

export default FarmerDashboard;