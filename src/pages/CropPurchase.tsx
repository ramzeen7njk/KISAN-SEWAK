import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { calculateMSPPayment } from '../utils/taxCalculator';
import PaymentDetailsModal from '../components/PaymentDetailsModal';

interface StorageRequest {
  id: string;
  farmer_id: string;
  crop_type: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  storage_facility_id: string;
  created_at: string;
  payment_status?: 'pending' | 'paid';
  payment_amount?: number;
  farmer: {
    name: string;
    phone: string;
    selected_district: string;
    bank_account: string;
    ifsc_code: string;
  };
  storage_facility: {
    name: string;
    district: string;
  };
}

const CropPurchase: React.FC = () => {
  const [storageRequests, setStorageRequests] = useState<StorageRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    fetchStorageRequests();
  }, []);

  const fetchStorageRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('storage_requests')
        .select(`
          *,
          farmer:farmer_id(*),
          storage_facility:storage_facility_id(*)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStorageRequests(data || []);
    } catch (error) {
      console.error('Error fetching storage requests:', error);
      toast.error('Failed to load storage requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const request = storageRequests.find(r => r.id === requestId);
      if (!request) return;

      // If approving, check if facility has enough space
      if (status === 'approved') {
        // Convert kg to tons (1 ton = 1000 kg)
        const quantityInTons = request.quantity / 1000;

        // Get current facility details
        const { data: facilityData, error: facilityFetchError } = await supabase
          .from('storage_facilities')
          .select('available_space')
          .eq('id', request.storage_facility_id)
          .single();

        if (facilityFetchError) throw facilityFetchError;
        if (!facilityData) throw new Error('Storage facility not found');

        if (quantityInTons > facilityData.available_space) {
          toast.error('Storage facility does not have enough available space');
          return;
        }

        // Update available space in storage facility
        const { error: facilityUpdateError } = await supabase
          .from('storage_facilities')
          .update({
            available_space: facilityData.available_space - quantityInTons
          })
          .eq('id', request.storage_facility_id);

        if (facilityUpdateError) throw facilityUpdateError;

        // Calculate payment based on MSP and apply tax if applicable
        // Calculate MSP payment without tax deduction for now
        const mspPayment = calculateMSPPayment(request.quantity, request.crop_type);
        const paymentAmount = mspPayment; // No tax deduction until annual_income is properly implemented

        // Set payment details for modal
        setPaymentDetails({
          cropType: request.crop_type,
          quantity: request.quantity,
          mspAmount: mspPayment,
          finalAmount: paymentAmount
        });
        setShowPaymentModal(true);

        // Update request status and set initial payment details if approved
        const { error: requestError } = await supabase
          .from('storage_requests')
          .update({
            status,
            payment_status: 'pending',
            payment_amount: paymentAmount,
            payment_date: null
          })
          .eq('id', requestId);

        if (requestError) throw requestError;
      } else {
        // If rejecting, just update the status
        const { error: requestError } = await supabase
          .from('storage_requests')
          .update({
            status,
            payment_status: null,
            payment_amount: null,
            payment_date: null
          })
          .eq('id', requestId);

        if (requestError) throw requestError;
      }

      toast.success(`Request ${status} successfully`);
      fetchStorageRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
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
      {showPaymentModal && paymentDetails && (
        <PaymentDetailsModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          paymentDetails={paymentDetails}
        />
      )}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Storage Requests Management</h1>

        {storageRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No pending storage requests available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop Information</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage Facility</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {storageRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{request.farmer.name}</div>
                      <div className="text-sm text-gray-500">{request.farmer.phone}</div>
                      <div className="text-sm text-gray-500">{request.farmer.selected_district}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{request.crop_type}</div>
                      <div className="text-sm text-gray-500">{request.quantity} kg</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{request.storage_facility.name}</div>
                      <div className="text-sm text-gray-500">{request.storage_facility.district}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(request.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                        className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors duration-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors duration-200"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPurchase;