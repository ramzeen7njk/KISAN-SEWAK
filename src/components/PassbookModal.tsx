import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PassbookModalProps {
  passbookNumber: string;
  onClose: () => void;
}

const PassbookModal: React.FC<PassbookModalProps> = ({ passbookNumber, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Your Passbook Number
            </h2>
            <div className="bg-green-50 p-6 rounded-lg text-center mb-6">
              <p className="text-3xl font-mono font-bold text-green-700 tracking-wider">
                {passbookNumber}
              </p>
            </div>
            <div className="text-center text-gray-600">
              <p className="mb-2">Please save this passbook number.</p>
              <p>You will need it to login to your account.</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-gray-50 px-6 py-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(passbookNumber);
                alert('Passbook number copied to clipboard!');
              }}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PassbookModal; 