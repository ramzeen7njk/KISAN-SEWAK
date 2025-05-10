import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../config/supabase';
import type { StorageFacility } from '../types/storage';

interface CropAllocation {
  id: string;
  farmer_id: string;
  crop_name: string;
  harvest_quantity: number;
  harvest_date: string;
  expiry_date: string;
  status: 'harvested' | 'stored' | 'sold';
}

const SellCrops = () => {
  const [harvestedCrops, setHarvestedCrops] = useState<CropAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageFacilities, setStorageFacilities] = useState<StorageFacility[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [selectedCropType, setSelectedCropType] = useState('');
  const [requestQuantity, setRequestQuantity] = useState('');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<string>('');

  useEffect(() => {
    loadHarvestedCrops();
    loadFarmerDistrict();
  }, []);

  const loadHarvestedCrops = async () => {
    try {
      setIsLoading(true);
      const farmerId = localStorage.getItem('userId');
      const { data, error } = await supabase
        .from('crop_allocations')
        .select('*')
        .eq('farmer_id', farmerId)
        .eq('status', 'harvested');

      if (error) throw error;
      setHarvestedCrops(data || []);
    } catch (error) {
      console.error('Error loading harvested crops:', error);
      toast.error('Failed to load harvested crops');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFarmerDistrict = async () => {
    try {
      const farmerId = localStorage.getItem('userId');
      const { data: farmer } = await supabase
        .from('farmers')
        .select('selected_district')
        .eq('id', farmerId)
        .single();

      if (farmer?.selected_district) {
        setSelectedDistrict(farmer.selected_district);
        await loadStorageFacilities(farmer.selected_district);
      }
    } catch (error) {
      console.error('Error loading farmer district:', error);
      toast.error('Failed to load farmer district');
    }
  };

  const loadStorageFacilities = async (district: string) => {
    try {
      const { data: facilities, error } = await supabase
        .from('storage_facilities')
        .select('*')
        .eq('status', 'active')
        .ilike('district', district);

      if (error) throw error;
      setStorageFacilities(facilities || []);
    } catch (error) {
      console.error('Error loading storage facilities:', error);
      toast.error('Failed to load storage facilities');
    }
  };

  const handleSearchFacilities = async () => {
    if (!searchDistrict.trim()) {
      toast.error('Please enter a district to search');
      return;
    }
    await loadStorageFacilities(searchDistrict.trim());
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStorageRequest = async () => {
    const farmerId = localStorage.getItem('userId');
    if (!farmerId || !selectedCropType || !requestQuantity || !selectedFacility) {
      toast.error('Please select a crop, specify the quantity, and choose a storage facility');
      return;
    }

    if (isSubmitting) return; // Prevent duplicate submissions

    try {
      setIsSubmitting(true);
      const crop = harvestedCrops.find(c => c.crop_name === selectedCropType);
      const quantityInKg = parseFloat(requestQuantity);
      const quantityInTons = quantityInKg / 1000; // Convert kg to tons

      if (!crop) {
        toast.error('Selected crop not found');
        return;
      }

      if (quantityInKg > crop.harvest_quantity) {
        toast.error('Requested quantity cannot exceed harvest quantity');
        return;
      }

      // Check if facility has enough space
      const { data: facilityData, error: facilityError } = await supabase
        .from('storage_facilities')
        .select('available_space')
        .eq('id', selectedFacility)
        .single();

      if (facilityError) throw facilityError;
      if (!facilityData) {
        toast.error('Storage facility not found');
        return;
      }

      if (quantityInTons > facilityData.available_space) {
        toast.error('Storage facility does not have enough available space');
        return;
      }

      const { error } = await supabase
        .from('storage_requests')
        .insert([{
          farmer_id: farmerId,
          crop_type: selectedCropType,
          quantity: quantityInKg,
          status: 'pending',
          storage_facility_id: selectedFacility
        }]);

      if (error) throw error;
      toast.success('Storage request submitted successfully');
      setShowStorageModal(false);
      setSelectedCropType('');
      setRequestQuantity('');
      setSelectedFacility('');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit storage request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRemainingDays = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Sell Your Harvested Crops</h2>
      
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {harvestedCrops.map((crop) => {
            const remainingDays = getRemainingDays(crop.expiry_date);
            return (
              <div key={crop.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-xl text-gray-800">{crop.crop_name}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                </div>
                
                <div className="space-y-2 text-gray-600">
                  <p className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-medium">{crop.harvest_quantity} kg</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Harvested:</span>
                    <span>{formatDate(crop.harvest_date)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Expires:</span>
                    <span>{formatDate(crop.expiry_date)}</span>
                  </p>
                </div>
              </div>
            );
          })}
          {harvestedCrops.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No harvested crops available</p>
              <p className="text-gray-400 mt-2">Harvest your crops first to sell them</p>
            </div>
          )}
        </div>

        {harvestedCrops.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowStorageModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Request Storage
            </button>
          </div>
        )}
      </div>

      {showStorageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Request Storage Facility</h3>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Available Storage Facilities in {selectedDistrict}</h4>
              {storageFacilities.length > 0 ? (
                <div className="space-y-2">
                  {storageFacilities.map((facility) => {
                    const occupiedPercentage = facility.available_space && facility.capacity ? 
                      ((facility.capacity - facility.available_space) / facility.capacity) * 100 : 0;
                    return (
                      <div 
                        key={facility.id} 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedFacility === facility.id ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedFacility(facility.id)}
                      >
                        <p className="font-medium">{facility.name}</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${occupiedPercentage >= 90 ? 'bg-red-500' : occupiedPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(occupiedPercentage, 100)}%` }}
                            />
                          </div>
                          <div className="mt-1 flex justify-between text-sm text-gray-600">
                            <span>Occupied: {((facility.capacity - facility.available_space) || 0).toFixed(1)} tons ({occupiedPercentage.toFixed(1)}%)</span>
                            <span>Available: {(facility.available_space || 0).toFixed(1)} tons</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No storage facilities available in this district</p>
              )}

              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Search facilities in other districts:</p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchDistrict}
                    onChange={(e) => setSearchDistrict(e.target.value)}
                    placeholder="Enter district name"
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <button
                    onClick={handleSearchFacilities}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <select
                value={selectedCropType}
                onChange={(e) => setSelectedCropType(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Crop Type</option>
                {harvestedCrops.map((crop) => (
                  <option key={crop.id} value={crop.crop_name}>
                    {crop.crop_name} ({crop.harvest_quantity} kg available)
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={requestQuantity}
                onChange={(e) => setRequestQuantity(e.target.value)}
                placeholder="Enter quantity (kg)"
                className="w-full p-2 border rounded-lg"
                min="1"
              />

              <div className="flex space-x-2">
                <button
                  onClick={handleStorageRequest}
                  disabled={isSubmitting}
                  className={`flex-1 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-lg transition-colors`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  onClick={() => {
                    setShowStorageModal(false);
                    setSelectedCropType('');
                    setRequestQuantity('');
      setSelectedFacility('');
                  }}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellCrops;
