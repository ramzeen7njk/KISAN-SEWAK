import React from 'react';
import { TaxCalculationResult } from '../utils/taxCalculator';

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentDetails: {
    cropType: string;
    quantity: number;
    mspAmount: number;
    taxCalculation: TaxCalculationResult;
    finalAmount: number;
  };
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  onClose,
  paymentDetails
}) => {
  if (!isOpen) return null;

  const {
    cropType,
    quantity,
    mspAmount,
    taxCalculation,
    finalAmount
  } = paymentDetails;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Payment Details</h3>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h4 className="font-medium mb-2">Crop Details</h4>
            <p className="text-gray-600">Type: {cropType}</p>
            <p className="text-gray-600">Quantity: {quantity} kg</p>
          </div>

          <div className="border-b pb-4">
            <h4 className="font-medium mb-2">MSP Calculation</h4>
            <p className="text-gray-600">MSP Rate: ₹{(mspAmount / quantity).toFixed(2)}/kg</p>
            <p className="text-gray-600">Total MSP Amount: ₹{mspAmount.toFixed(2)}</p>
          </div>

          {taxCalculation?.taxAmount > 0 && (
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">Tax Breakdown</h4>
              {taxCalculation?.taxBreakdown?.map((breakdown, index) => (
                <div key={index} className="text-sm text-gray-600">
                  <p>Income Range: ₹{breakdown.bracket.min.toLocaleString()} - ₹{breakdown.bracket.max.toLocaleString()}</p>
                  <p>Tax Rate: {(breakdown.bracket.rate * 100).toFixed(0)}%</p>
                  <p>Tax Amount: ₹{breakdown.taxForBracket.toFixed(2)}</p>
                </div>
              ))}
              <p className="mt-2 font-medium">Total Tax: ₹{taxCalculation.taxAmount.toFixed(2)}</p>
            </div>
          )}

          <div className="pt-4">
            <h4 className="font-medium mb-2">Final Payment</h4>
            <p className="text-2xl font-bold text-green-600">₹{finalAmount.toFixed(2)}</p>
            {taxCalculation?.taxAmount > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                (After tax deduction of ₹{taxCalculation?.taxAmount.toFixed(2)})
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;