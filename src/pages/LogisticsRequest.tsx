import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface LogisticsRequest {
  id: string;
  farmer_id: string;
  crop_type: string;
  quantity: number;
  status: string;
  storage_facility_id: string;
  created_at: string;
  payment_status: string;
  payment_amount: number;
  logistics_status?: 'pending' | 'requested' | 'in_transit' | 'delivered';
  logistics_company?: string;
  logistics_contact?: string;
  logistics_license?: string;
  accepted_at?: string;
  farmer: {
    name: string;
    phone: string;
    selected_district: string;
    address: string;
  };
  storage_facility: {
    name: string;
    district: string;
    address: string;
  };
}

interface LogisticsCompany {
  id: string;
  name: string;
  district: string;
  rating: number;
  available_vehicles: number;
  contact_number: string;
}

const LogisticsRequest: React.FC = () => {
  const [paidRequests, setPaidRequests] = useState<LogisticsRequest[]>([]);
  const [logisticsCompanies, setLogisticsCompanies] = useState<LogisticsCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  useEffect(() => {
    fetchPaidRequests();
  }, []);

  const fetchPaidRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('storage_requests')
        .select(`
          *,
          farmer:farmer_id(*),
          storage_facility:storage_facility_id(*)
        `)
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaidRequests(data || []);
    } catch (error) {
      console.error('Error fetching paid requests:', error);
      toast.error('Failed to load paid requests');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogisticsCompanies = async (district: string) => {
    try {
      const { data, error } = await supabase
        .from('logistics_companies')
        .select('*')
        .eq('district', district)
        .order('rating', { ascending: false });

      if (error) throw error;
      setLogisticsCompanies(data || []);
    } catch (error) {
      console.error('Error fetching logistics companies:', error);
      toast.error('Failed to load logistics companies');
    }
  };

  const handleRequestLogistics = async (requestId: string) => {
    try {
      const request = paidRequests.find(r => r.id === requestId);
      if (!request) return;

      await fetchLogisticsCompanies(request.storage_facility.district);
      setSelectedRequest(requestId);

      const { error: updateError } = await supabase
        .from('storage_requests')
        .update({
          logistics_status: 'requested'
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast.success('Logistics request sent successfully');
      fetchPaidRequests(); // Refresh the list
    } catch (error) {
      console.error('Error requesting logistics:', error);
      toast.error('Failed to request logistics');
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Logistics Requests</h1>

        {paidRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No paid requests available for logistics</p>
          </div>
        ) : (
          <div className="space-y-6">
            {paidRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Farmer Details</h3>
                    <p><span className="font-medium">Name:</span> {request.farmer.name}</p>
                    <p><span className="font-medium">Phone:</span> {request.farmer.phone}</p>
                    <p><span className="font-medium">District:</span> {request.farmer.selected_district}</p>
                    <p><span className="font-medium">Address:</span> {request.farmer.address}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Crop Details</h3>
                    <p><span className="font-medium">Type:</span> {request.crop_type}</p>
                    <p><span className="font-medium">Quantity:</span> {request.quantity} kg</p>
                    <p><span className="font-medium">Payment Status:</span> 
                      <span className="text-green-600">Paid</span>
                    </p>
                    <p><span className="font-medium">Date:</span> {formatDate(request.created_at)}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Storage Facility</h3>
                    <p><span className="font-medium">Name:</span> {request.storage_facility.name}</p>
                    <p><span className="font-medium">District:</span> {request.storage_facility.district}</p>
                    <p><span className="font-medium">Address:</span> {request.storage_facility.address}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  {request.logistics_status === 'in_transit' ? (
                    <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full">
                      Order Accepted
                    </div>
                  ) : request.logistics_status === 'requested' ? (
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full">
                      Logistics Request Sent
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRequestLogistics(request.id)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Request Logistics
                    </button>
                  )}
                </div>

                {selectedRequest === request.id && logisticsCompanies.length > 0 && (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Available Logistics Companies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {logisticsCompanies.map((company) => (
                        <div key={company.id} className="border rounded-lg p-4">
                          <h4 className="font-semibold">{company.name}</h4>
                          <p><span className="font-medium">Rating:</span> {company.rating}/5</p>
                          <p><span className="font-medium">Available Vehicles:</span> {company.available_vehicles}</p>
                          <p><span className="font-medium">Contact:</span> {company.contact_number}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsRequest;