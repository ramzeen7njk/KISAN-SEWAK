import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Loader2, MoreVertical } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { StorageFacility, StorageInventory } from '../types/storage';
import { toast } from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FacilityInventory extends StorageFacility {
  inventory: StorageInventory[];
}

const InventoryManagement = () => {
  const [facilities, setFacilities] = useState<FacilityInventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);

  useEffect(() => {
    fetchFacilitiesWithInventory();
  }, []);

  const fetchFacilitiesWithInventory = async () => {
    try {
      // Fetch all storage facilities
      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from('storage_facilities')
        .select('*');

      if (facilitiesError) throw facilitiesError;

      // Fetch inventory for each facility
      const facilitiesWithInventory = await Promise.all(
        (facilitiesData || []).map(async (facility) => {
          // Get delivered storage requests for this facility
          const { data: deliveredRequests, error: requestsError } = await supabase
            .from('storage_requests')
            .select('crop_type, quantity')
            .eq('storage_facility_id', facility.id)
            .eq('logistics_status', 'delivered');

          if (requestsError) throw requestsError;

          // Calculate total occupied space and group by crop type
          const inventoryMap = new Map<string, number>();
          let totalOccupied = 0;

          deliveredRequests?.forEach(request => {
            const quantityInTons = request.quantity / 1000; // Convert kg to tons
            totalOccupied += quantityInTons;
            
            const currentQuantity = inventoryMap.get(request.crop_type) || 0;
            inventoryMap.set(request.crop_type, currentQuantity + quantityInTons);
          });

          // Convert map to array of inventory items
          const inventory = Array.from(inventoryMap.entries()).map(([crop_type, quantity]) => ({
            id: `${facility.id}-${crop_type}`,
            facility_id: facility.id,
            crop_type,
            quantity,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          }));

          return {
            ...facility,
            inventory,
            current_stock: totalOccupied
          };
        })
      );

      setFacilities(facilitiesWithInventory);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast.error('Failed to fetch inventory data');
    } finally {
      setIsLoading(false);
    }
  };

  // Add real-time subscription for storage_requests
  useEffect(() => {
    const channel = supabase
      .channel('storage_requests_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'storage_requests' 
        }, 
        () => {
          fetchFacilitiesWithInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getChartData = (facility: FacilityInventory) => {
    const totalOccupied = facility.inventory.reduce((sum, item) => sum + item.quantity, 0);
    const availableSpace = facility.available_space;

    return {
      labels: ['Space Utilization'],
      datasets: [
        {
          label: 'Available Space',
          data: [availableSpace],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Occupied Space',
          data: [totalOccupied],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getCropDistributionData = (facility: FacilityInventory) => {
    const labels = facility.inventory.map(item => item.crop_type);
    const quantities = facility.inventory.map(item => item.quantity);

    return {
      labels,
      datasets: [
        {
          label: 'Crop Distribution (tons)',
          data: quantities,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
      },
      x: {
        stacked: true,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Inventory Management</h2>
      
      {facilities.length === 0 ? (
        <div className="text-center text-gray-500">
          No storage facilities found. Please create a facility first.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-lg shadow-md p-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{facility.name}</h3>
                  <p className="text-gray-600">
                    {facility.district}, {facility.state}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${facility.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {facility.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Capacity</p>
                    <p className="text-lg font-semibold">{facility.capacity} tons</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === facility.id ? null : facility.id)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {activeDropdown === facility.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <button
                          onClick={async () => {
                            try {
                              const newStatus = facility.status === 'active' ? 'inactive' : 'active';
                              const { error } = await supabase
                                .from('storage_facilities')
                                .update({ status: newStatus })
                                .eq('id', facility.id);
                              
                              if (error) throw error;
                              
                              // Update the facility status in the local state immediately
                              setFacilities(prevFacilities =>
                                prevFacilities.map(f =>
                                  f.id === facility.id ? { ...f, status: newStatus } : f
                                )
                              );
                              
                              toast.success(`Storage facility ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
                            } catch (error) {
                              console.error('Error updating facility status:', error);
                              toast.error('Failed to update facility status');
                            }
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {facility.status === 'active' ? 'Make Storage Inactive' : 'Make Storage Active'}
                        </button>
                        <button
                          onClick={() => {
                            setShowConfirmDialog(facility.id);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Remove Inventory
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {showConfirmDialog === facility.id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4">Confirm Inventory Removal</h3>
                    <p className="text-gray-600 mb-6">Are you sure you want to remove all inventory from this storage facility? This action cannot be undone.</p>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setShowConfirmDialog(null)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            // First, update the storage facility's available space
                            const { error: facilityError } = await supabase
                              .from('storage_facilities')
                              .update({ available_space: facility.capacity })
                              .eq('id', facility.id);
                            
                            if (facilityError) throw facilityError;

                            // Then delete all inventory records
                            const { error: inventoryError } = await supabase
                              .from('storage_inventory')
                              .delete()
                              .eq('facility_id', facility.id);
                            
                            if (inventoryError) throw inventoryError;
                            
                            // Update local state
                            setFacilities(prevFacilities =>
                              prevFacilities.map(f =>
                                f.id === facility.id ? { ...f, inventory: [], available_space: facility.capacity } : f
                              )
                            );
                            
                            toast.success('Inventory removed successfully');
                          } catch (error) {
                            console.error('Error removing inventory:', error);
                            toast.error('Failed to remove inventory');
                          }
                          setShowConfirmDialog(null);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Remove Inventory
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Space Utilization Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium mb-4">Space Utilization</h4>
                  <div className="h-64">
                    <Bar data={getChartData(facility)} options={chartOptions} />
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Total Capacity: {facility.capacity.toFixed(2)} tons</p>
                    <p>Available Space: {facility.available_space.toFixed(2)} tons</p>
                    <p>Occupied Space: {facility.current_stock.toFixed(2)} tons</p>
                    <p>Utilization: {((facility.current_stock / facility.capacity) * 100).toFixed(1)}%</p>
                  </div>
                </div>

                {/* Crop Distribution Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium mb-4">Crop Distribution</h4>
                  <div className="h-64">
                    <Bar
                      data={getCropDistributionData(facility)}
                      options={chartOptions}
                    />
                  </div>
                </div>

                {/* Inventory Details */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-medium mb-4">Stored Crops</h4>
                  {facility.inventory.length === 0 ? (
                    <p className="text-gray-500">No crops stored yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Crop Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Quantity (tons)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Last Updated
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {facility.inventory.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {item.crop_type}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {item.quantity.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(item.updated_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
