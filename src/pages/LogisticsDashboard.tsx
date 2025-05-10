import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import {
  LayoutDashboard,
  Truck,
  MapPin,
  Calendar,
  ClipboardList,
  History,
  Users
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

interface FarmerInfo {
  name: string;
  mobile: string;
  district: string;
}

interface StorageFacilityInfo {
  name: string;
  district: string;
}

interface StorageRequest {
  id: string;
  crop_type: string;
  quantity: number;
  logistics_status: 'pending' | 'requested' | 'in_transit' | 'delivered';
  created_at: string;
  pickup_date: string | null;
  delivery_date: string | null;
  farmer: FarmerInfo;
  storage_facility: StorageFacilityInfo;
  farmer_id?: string;
  storage_facility_id?: string;
}

const sidebarItems = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: 'Overview',
    path: '/logistics/dashboard'
  },
  {
    icon: <Truck className="w-5 h-5" />,
    label: 'Vehicles',
    path: '/logistics/vehicles'
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: 'Routes',
    path: '/logistics/routes'
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    label: 'Schedule',
    path: '/logistics/schedule'
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    label: 'Orders',
    path: '/logistics/orders'
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: 'Drivers',
    path: '/logistics/drivers'
  },
  {
    icon: <History className="w-5 h-5" />,
    label: 'History',
    path: '/logistics/history'
  }
];

const LogisticsDashboard = () => {
  const [orders, setOrders] = useState<StorageRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'in_transit' | 'delivered'>('pending');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Get the session from localStorage
      const sessionStr = localStorage.getItem('logistics_session');
      if (!sessionStr) {
        setIsLoading(false);
        toast.error('Please login to view orders');
        return;
      }

      let session;
      try {
        session = JSON.parse(sessionStr);
      } catch (e) {
        setIsLoading(false);
        toast.error('Invalid session. Please login again.');
        return;
      }

      if (!session.user?.user_metadata?.license_number) {
        setIsLoading(false);
        toast.error('Invalid session data. Please login again.');
        return;
      }

      // Use the verification status from the session
      const verificationStatus = session.user.user_metadata.verification_status;
      
      if (verificationStatus !== 'approved') {
        toast.error('Your account is pending verification');
        setIsLoading(false);
        return;
      }

      // Set the Supabase auth header for subsequent requests
      supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: ''
      });

      // Get all storage orders
      const { data: requestsData, error: requestsError } = await supabase
        .from('storage_requests')
        .select('id, crop_type, quantity, logistics_status, created_at, farmer_id, storage_facility_id')
        .in('logistics_status', ['requested', 'in_transit', 'delivered'])
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching storage requests:', requestsError);
        toast.error('Failed to load orders');
        throw requestsError;
      }

      if (!requestsData || requestsData.length === 0) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      // Get farmer details for pickup
      const { data: farmersData, error: farmersError } = await supabase
        .from('farmers')
        .select('id, name, mobile, district')
        .in('id', requestsData.map(req => req.farmer_id));

      if (farmersError) {
        console.error('Error fetching farmers:', farmersError);
        toast.error('Failed to load farmer details');
        throw farmersError;
      }

      // Get storage facility details for delivery
      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from('storage_facilities')
        .select('id, name, district')
        .in('id', requestsData.map(req => req.storage_facility_id));

      if (facilitiesError) {
        console.error('Error fetching facilities:', facilitiesError);
        toast.error('Failed to load storage facility details');
        throw facilitiesError;
      }

      // Combine the data
      // Transform the data to match our interface
      const transformedData: StorageRequest[] = requestsData.map((request: any) => {
        const farmer = farmersData?.find(f => f.id === request.farmer_id);
        const facility = facilitiesData?.find(f => f.id === request.storage_facility_id);

        return {
          id: request.id,
          crop_type: request.crop_type,
          quantity: request.quantity,
          logistics_status: request.logistics_status,
          created_at: request.created_at,
          pickup_date: null,
          delivery_date: null,
          farmer_id: request.farmer_id,
          storage_facility_id: request.storage_facility_id,
          farmer: {
            name: farmer?.name || 'Unknown',
            mobile: farmer?.mobile || 'N/A',
            district: farmer?.district || 'N/A'
          },
          storage_facility: {
            name: facility?.name || 'Unknown',
            district: facility?.district || 'N/A'
          }
        };
      });

      setOrders(transformedData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      // Simply update the storage request status to in_transit
      const { error: updateError } = await supabase
        .from('storage_requests')
        .update({
          logistics_status: 'in_transit'
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error accepting order:', updateError);
        toast.error('Failed to accept order');
        return;
      }

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? {
                ...order,
                logistics_status: 'in_transit'
              }
            : order
        )
      );

      toast.success('Order accepted successfully');

    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order');
    }
  };

  const handleStatusUpdate = async (orderId: string, status: 'in_transit' | 'delivered') => {
    try {
      // Get the order details first
      const { data: orderData, error: orderError } = await supabase
        .from('storage_requests')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      // Update the storage request status
      const { error: updateError } = await supabase
        .from('storage_requests')
        .update({ 
          logistics_status: status
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // If the order is marked as delivered, update the crop allocation
      if (status === 'delivered') {
        // Get the farmer's crop allocation for this crop type
        const { data: cropAllocation, error: cropError } = await supabase
          .from('crop_allocations')
          .select('*')
          .eq('farmer_id', orderData.farmer_id)
          .eq('crop_name', orderData.crop_type)
          .eq('status', 'harvested')
          .order('harvest_date', { ascending: false })
          .limit(1);

        if (cropError) throw cropError;

        if (cropAllocation && cropAllocation.length > 0) {
          const allocation = cropAllocation[0];
          const newQuantity = allocation.harvest_quantity - orderData.quantity;

          // Update the crop allocation quantity
          const { error: updateAllocationError } = await supabase
            .from('crop_allocations')
            .update({ 
              harvest_quantity: newQuantity,
              status: newQuantity <= 0 ? 'stored' : 'harvested'
            })
            .eq('id', allocation.id);

          if (updateAllocationError) throw updateAllocationError;
        }

        toast.success('Order marked as delivered successfully');
      } else {
        toast.success('Order status updated successfully');
      }

      // Refresh the orders list
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userType="logistics"
      userName="Logistics Company"
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Logistics Dashboard</h1>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('in_transit')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'in_transit' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            In Transit
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'delivered' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Delivered
          </button>
        </div>
        <h2 className="text-xl font-semibold mb-6">{activeTab.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Orders</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No {activeTab} orders available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.filter(order => {
              if (activeTab === 'pending') return order.logistics_status === 'requested';
              return order.logistics_status === activeTab;
            }).map((order) => (
              <div key={order.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Pickup Details</h3>
                      <p><span className="font-medium">Farmer:</span> {order.farmer.name}</p>
                      <p><span className="font-medium">District:</span> {order.farmer.district}</p>
                      <button 
                        onClick={() => alert(`Farmer's Contact: ${order.farmer.mobile}`)}
                        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Contact for Details
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Delivery Details</h3>
                      <p><span className="font-medium">Storage Facility:</span> {order.storage_facility.name}</p>
                      <p><span className="font-medium">District:</span> {order.storage_facility.district}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                    <p><span className="font-medium">Crop Type:</span> {order.crop_type}</p>
                    <p><span className="font-medium">Quantity:</span> {order.quantity} kg</p>
                    <p><span className="font-medium">Created:</span> {formatDate(order.created_at)}</p>
                    {activeTab === 'pending' && (
                      <button
                        onClick={() => handleAcceptOrder(order.id)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Accept Order
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  {activeTab === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'in_transit')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Delivery
                    </button>
                  )}
                  {activeTab === 'in_transit' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'delivered')}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LogisticsDashboard;