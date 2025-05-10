import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { PieChart } from 'react-minimal-pie-chart';
import { toast } from 'react-hot-toast';

interface CropAllocation {
  id?: string;
  farmer_id: string;
  crop_name: string;
  allocated_acres: number;
  status: 'allocated' | 'harvested' | 'stored';
  harvest_quantity?: number;
  created_at?: string;
}

const CROP_COLORS = {
  wheat: '#FFB302',
  rice: '#34A853',
  corn: '#FBBC05',
  sugarcane: '#4285F4',
  cotton: '#EA4335',
  default: '#9CA3AF'
};

const MyCrops = () => {
  const navigate = useNavigate();
  const [farmerData, setFarmerData] = useState<any>(null);
  const [cropAllocations, setCropAllocations] = useState<CropAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [allocatedAcres, setAllocatedAcres] = useState('');
  const [remainingAcres, setRemainingAcres] = useState(0);
  const [harvestQuantity, setHarvestQuantity] = useState('');

  useEffect(() => {
    loadFarmerAndCrops();
  }, []);

  const loadFarmerAndCrops = async () => {
    try {
      const farmerId = localStorage.getItem('userId');
      if (!farmerId) {
        navigate('/farmer/login');
        return;
      }

      // Load farmer data
      const { data: farmer, error: farmerError } = await supabase
        .from('farmers')
        .select('*')
        .eq('id', farmerId)
        .single();

      if (farmerError) throw farmerError;
      setFarmerData(farmer);

      // Load crop allocations
      const { data: allocations, error: allocationsError } = await supabase
        .from('crop_allocations')
        .select('*')
        .eq('farmer_id', farmerId);

      if (allocationsError) throw allocationsError;
      setCropAllocations(allocations || []);

      // Calculate remaining acres
      const totalAllocated = (allocations || []).reduce(
        (sum, allocation) => sum + allocation.allocated_acres,
        0
      );
      setRemainingAcres(farmer.land_acres - totalAllocated);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load farmer data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllocateCrop = async () => {
    try {
      if (!selectedCrop || !allocatedAcres) {
        toast.error('Please select a crop and enter acres');
        return;
      }

      const acres = parseFloat(allocatedAcres);
      if (acres <= 0 || acres > remainingAcres) {
        toast.error('Invalid acres amount');
        return;
      }

      const farmerId = localStorage.getItem('userId');
      const { error } = await supabase
        .from('crop_allocations')
        .insert([{
          farmer_id: farmerId,
          crop_name: selectedCrop,
          allocated_acres: acres,
          status: 'allocated'
        }]);

      if (error) throw error;

      toast.success('Crop allocated successfully');
      await loadFarmerAndCrops();
      setSelectedCrop('');
      setAllocatedAcres('');
    } catch (error) {
      console.error('Error allocating crop:', error);
      toast.error('Failed to allocate crop');
    }
  };

  const handleHarvest = async (allocationId: string) => {
    try {
      if (!harvestQuantity) {
        toast.error('Please enter harvest quantity');
        return;
      }

      const quantity = parseFloat(harvestQuantity);
      if (quantity <= 0) {
        toast.error('Invalid harvest quantity');
        return;
      }

      const { error } = await supabase
        .from('crop_allocations')
        .update({
          status: 'harvested',
          harvest_quantity: quantity
        })
        .eq('id', allocationId);

      if (error) throw error;

      toast.success('Crop harvested successfully');
      await loadFarmerAndCrops();
      setHarvestQuantity('');
    } catch (error) {
      console.error('Error harvesting crop:', error);
      toast.error('Failed to harvest crop');
    }
  };

  const getPieChartData = () => {
    return cropAllocations.map((allocation) => ({
      title: allocation.crop_name,
      value: allocation.allocated_acres,
      color: CROP_COLORS[allocation.crop_name as keyof typeof CROP_COLORS] || CROP_COLORS.default
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Crops</h1>

      {/* Land Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Land Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 mb-2">Total Land: {farmerData?.land_acres} acres</p>
            <p className="text-gray-600 mb-4">Remaining Land: {remainingAcres} acres</p>

            {/* Crop Allocation Form */}
            {remainingAcres > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Allocate New Crop</h3>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Crop</option>
                  {farmerData?.crops_cultivated?.split(',').map((crop: string) => (
                    <option key={crop.trim()} value={crop.trim()}>
                      {crop.trim()}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={allocatedAcres}
                  onChange={(e) => setAllocatedAcres(e.target.value)}
                  placeholder="Acres to allocate"
                  className="w-full p-2 border rounded"
                  min="0.1"
                  max={remainingAcres}
                  step="0.1"
                />
                <button
                  onClick={handleAllocateCrop}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Allocate Crop
                </button>
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="relative" style={{ height: '300px' }}>
            {cropAllocations.length > 0 ? (
              <>
                <PieChart
                  data={getPieChartData()}
                  label={({ dataEntry }) => `${dataEntry.title} (${dataEntry.value}ac)`}
                  labelStyle={{ fontSize: '5px' }}
                  labelPosition={60}
                  lineWidth={50}
                  animate
                />
                <p className="text-center mt-4 text-sm text-gray-600">
                  Crop Allocation Distribution
                </p>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No crops allocated yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Allocated Crops List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Allocated Crops</h2>
        <div className="space-y-4">
          {cropAllocations.length === 0 ? (
            <p className="text-gray-500">No crops allocated yet</p>
          ) : (
            cropAllocations.map((allocation) => (
              <div
                key={allocation.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{allocation.crop_name}</h3>
                    <p className="text-sm text-gray-600">
                      Allocated: {allocation.allocated_acres} acres
                    </p>
                    {allocation.harvest_quantity && (
                      <p className="text-sm text-gray-600">
                        Harvested: {allocation.harvest_quantity} kg
                      </p>
                    )}
                  </div>
                  {allocation.status === 'allocated' && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Harvest quantity (kg)"
                        className="p-2 border rounded"
                        value={harvestQuantity}
                        onChange={(e) => setHarvestQuantity(e.target.value)}
                      />
                      <button
                        onClick={() => handleHarvest(allocation.id!)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Harvest
                      </button>
                    </div>
                  )}
                  {allocation.status === 'harvested' && (
                    <span className="text-green-600">✓ Harvested</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCrops;
