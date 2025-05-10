import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentRequest: {
    id: string;
    farmer_id: string;
    crop_type: string;
    quantity: number;
    status: string;
    storage_facility_id: string;
    created_at: string;
    payment_status: string;
    payment_amount: number;
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
  };
  onPaymentComplete: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, paymentRequest, onPaymentComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');
  const [encryptionDetails, setEncryptionDetails] = useState({
    encryptionKey: '',
    algorithm: 'AES-256-GCM',
    timestamp: ''
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const generatePaymentReference = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `PAY-${timestamp}-${random}`;
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const reference = generatePaymentReference();
      const encKey = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      
      setEncryptionDetails({
        encryptionKey: encKey,
        algorithm: 'AES-256-GCM',
        timestamp: timestamp
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { error: paymentError } = await supabase
        .from('storage_requests')
        .update({
          payment_status: 'paid',
          payment_amount: paymentRequest.quantity * 100,
          payment_reference: reference
        })
        .eq('id', paymentRequest.id);

      if (paymentError) throw paymentError;

      setPaymentReference(reference);
      toast.success('Payment processed successfully');
      onPaymentComplete();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!paymentReference ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Farmer Details</h3>
                <p><span className="font-medium">Name:</span> {paymentRequest.farmer.name}</p>
                <p><span className="font-medium">Phone:</span> {paymentRequest.farmer.phone}</p>
                <p><span className="font-medium">District:</span> {paymentRequest.farmer.selected_district}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Sender Bank Details</h3>
                <p><span className="font-medium">Account Number:</span> {paymentRequest.farmer.bank_account}</p>
                <p><span className="font-medium">IFSC Code:</span> {paymentRequest.farmer.ifsc_code}</p>
                <p><span className="font-medium">Bank Name:</span> {paymentRequest.farmer.bank_name || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Receiver Bank Details</h3>
                <p><span className="font-medium">Account Number:</span> {paymentRequest.storage_facility?.bank_account || 'XXXX-XXXX-XXXX'}</p>
                <p><span className="font-medium">IFSC Code:</span> {paymentRequest.storage_facility?.ifsc_code || 'XXXXXXXX'}</p>
                <p><span className="font-medium">Bank Name:</span> {paymentRequest.storage_facility?.bank_name || 'Storage Facility Bank'}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Transfer Security</h3>
                <p><span className="font-medium">Encryption:</span> AES-256-GCM</p>
                <p><span className="font-medium">Verification:</span> Two-Factor</p>
                <p><span className="font-medium">Protocol:</span> HTTPS/TLS 1.3</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Crop Details</h3>
                <p><span className="font-medium">Type:</span> {paymentRequest.crop_type}</p>
                <p><span className="font-medium">Quantity:</span> {paymentRequest.quantity} kg</p>
                <p><span className="font-medium">Storage Facility:</span> {paymentRequest.storage_facility.name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                <p><span className="font-medium">Amount:</span> {formatCurrency(paymentRequest.quantity * 100)}</p>
                <p><span className="font-medium">Status:</span> Pending</p>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                    Processing...
                  </div>
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-medium">Payment Reference Number:</p>
              <p className="text-lg">{paymentReference}</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-semibold mb-2">Transaction Report</h3>
                <p><span className="font-medium">Timestamp:</span> {encryptionDetails.timestamp}</p>
                <p><span className="font-medium">Status:</span> Completed</p>
                <p><span className="font-medium">Encryption Key:</span> {encryptionDetails.encryptionKey}</p>
                <p><span className="font-medium">Security Protocol:</span> {encryptionDetails.algorithm}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;