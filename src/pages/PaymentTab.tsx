import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import PaymentModal from '../components/PaymentModal';
import PaymentHistoryModal from '../components/PaymentHistoryModal';

interface PaymentRequest {
  id: string;
  farmer_id: string;
  crop_type: string;
  quantity: number;
  status: string;
  storage_facility_id: string;
  created_at: string;
  payment_status: string;
  payment_amount: number;
  payment_reference: string;
  farmer: {
    name: string;
    phone: string;
    selected_district: string;
    bank_account: string;
    ifsc_code: string;
    bank_name: string;
  };
  storage_facility: {
    name: string;
    district: string;
    bank_account: string;
    ifsc_code: string;
    bank_name: string;
  };
}

const PaymentTab: React.FC = () => {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPaymentRequests();
  }, []);

  const fetchPaymentRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('storage_requests')
        .select(`
          *,
          farmer:farmer_id(*),
          storage_facility:storage_facility_id(*)
        `)
        .eq('status', 'approved')
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentRequests(data || []);
    } catch (error) {
      console.error('Error fetching payment requests:', error);
      toast.error('Failed to load payment requests');
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const handlePaymentClick = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    fetchPaymentRequests(); // Refresh the list
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setShowHistoryModal(false);
    setSelectedRequest(null);
  };

  const handleViewDetails = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setShowHistoryModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment Management</h1>

        {paymentRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No approved storage requests available for payment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop Information</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage Facility</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentRequests.map((request) => {
                  const paymentAmount = request.quantity * 100; // Example: 100 rupees per kg
                  return (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{request.farmer.name}</div>
                        <div className="text-sm text-gray-500">{request.farmer.phone}</div>
                        <div className="text-sm text-gray-500">{request.farmer.selected_district}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{request.crop_type}</div>
                        <div className="text-sm text-gray-500">{request.quantity} kg</div>
                        <div className="text-sm font-medium text-green-600">{formatCurrency(paymentAmount)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{request.storage_facility.name}</div>
                        <div className="text-sm text-gray-500">{request.storage_facility.district}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">A/C: {request.farmer.bank_account}</div>
                        <div className="text-sm text-gray-500">IFSC: {request.farmer.ifsc_code}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {request.payment_status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-y-2">
                        {request.payment_status !== 'paid' ? (
                          <button
                            onClick={() => handlePaymentClick(request)}
                            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
                          >
                            Process Payment
                          </button>
                        ) : (
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors duration-200"
                          >
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showPaymentModal && selectedRequest && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handleCloseModal}
          paymentRequest={selectedRequest}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
      {showHistoryModal && selectedRequest && (
        <PaymentHistoryModal
          isOpen={showHistoryModal}
          onClose={handleCloseModal}
          paymentRequest={selectedRequest}
        />
      )}
    </div>
  );
};

export default PaymentTab;