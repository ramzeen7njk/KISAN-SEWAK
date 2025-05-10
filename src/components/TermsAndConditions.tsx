import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, UserCheck, Scale, FileWarning, BookOpen } from 'lucide-react';

interface TermsAndConditionsProps {
  onClose: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <BookOpen className="h-8 w-8 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">Terms and Conditions</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Legal Framework */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Scale className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">Legal Framework</h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>This platform operates under the following Indian laws and regulations:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>The Farmers' Produce Trade and Commerce (Promotion and Facilitation) Act, 2020</li>
                  <li>The Essential Commodities (Amendment) Act, 2020</li>
                  <li>The Farmers (Empowerment and Protection) Agreement on Price Assurance and Farm Services Act, 2020</li>
                  <li>Information Technology Act, 2000</li>
                  <li>Consumer Protection Act, 2019</li>
                </ul>
              </div>
            </section>

            {/* User Rights */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <UserCheck className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">User Rights and Responsibilities</h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <h4 className="font-medium text-gray-700">Registration and Account</h4>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Users must provide accurate and truthful information during registration</li>
                  <li>Users are responsible for maintaining the confidentiality of their account credentials</li>
                  <li>Multiple registrations using the same credentials are prohibited</li>
                  <li>Users must promptly update their information if any changes occur</li>
                </ul>

                <h4 className="font-medium text-gray-700 mt-6">Compliance Requirements</h4>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Users must comply with all applicable agricultural laws and regulations</li>
                  <li>Trading must be conducted in accordance with fair market practices</li>
                  <li>Users must maintain required licenses and permits for their operations</li>
                  <li>Quality standards and safety regulations must be adhered to</li>
                </ul>
              </div>
            </section>

            {/* Data Protection */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">Data Protection and Privacy</h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <ul className="list-disc ml-6 space-y-2">
                  <li>All user data is protected under the Information Technology Act, 2000</li>
                  <li>Personal information will be handled in accordance with Indian privacy laws</li>
                  <li>Users have the right to access, modify, and delete their personal information</li>
                  <li>Data sharing with third parties is strictly regulated and requires user consent</li>
                  <li>Security measures are implemented to protect user data from unauthorized access</li>
                </ul>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <FileWarning className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">Prohibited Activities</h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <ul className="list-disc ml-6 space-y-2">
                  <li>Engaging in fraudulent or deceptive practices</li>
                  <li>Manipulation of market prices or creating artificial scarcity</li>
                  <li>Sharing false or misleading information about products</li>
                  <li>Unauthorized use of other users' accounts or information</li>
                  <li>Violation of intellectual property rights</li>
                  <li>Harassment or discrimination against other users</li>
                </ul>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                By using this platform, you acknowledge that you have read, understood, and agree to be bound by these 
                terms and conditions. The platform reserves the right to modify these terms at any time, and users will 
                be notified of any changes.
              </p>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TermsAndConditions; 