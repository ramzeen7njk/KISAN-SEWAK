import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface AadharInputProps {
  register: UseFormRegister<any>;
  error?: string;
}

const AadharInput: React.FC<AadharInputProps> = ({ register, error }) => {
  const formatAadhar = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Add hyphens after every 4 digits
    const parts = [];
    for (let i = 0; i < digits.length && i < 12; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    
    return parts.join('-');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Aadhar Number
      </label>
      <input
        {...register('aadhar_number', {
          onChange: (e) => {
            e.target.value = formatAadhar(e.target.value);
          }
        })}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        placeholder="Enter your 12-digit Aadhar number"
        maxLength={14} // 12 digits + 2 hyphens
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default AadharInput; 