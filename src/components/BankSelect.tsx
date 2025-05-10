import React, { useState } from 'react';
import { INDIAN_BANKS } from '../data/banksList';

interface BankSelectProps {
  onBankChange: (bank: { name: string; ifscPrefix: string }) => void;
  bankError?: string;
  ifscError?: string;
}

const BankSelect: React.FC<BankSelectProps> = ({ onBankChange, bankError, ifscError }) => {
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [ifscCode, setIfscCode] = useState<string>('');

  const handleBankChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const bankId = event.target.value;
    setSelectedBank(bankId);
    const bank = INDIAN_BANKS.find(b => b.id === bankId);
    if (bank) {
      onBankChange({ name: bank.name, ifscPrefix: bank.ifscPrefix });
      // Reset IFSC code when bank changes
      setIfscCode(bank.ifscPrefix);
    }
  };

  const handleIfscChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase();
    setIfscCode(value);
    const bank = INDIAN_BANKS.find(b => b.id === selectedBank);
    if (bank) {
      onBankChange({ name: bank.name, ifscPrefix: value });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
        <select
          value={selectedBank}
          onChange={handleBankChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select your bank</option>
          {INDIAN_BANKS.map((bank) => (
            <option key={bank.id} value={bank.id}>
              {bank.name}
            </option>
          ))}
        </select>
        {bankError && (
          <p className="mt-1 text-sm text-red-600">{bankError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
        <input
          type="text"
          value={ifscCode}
          onChange={handleIfscChange}
          placeholder="Enter IFSC code"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          maxLength={11}
          disabled={!selectedBank}
        />
        {ifscError && (
          <p className="mt-1 text-sm text-red-600">{ifscError}</p>
        )}
        {selectedBank && (
          <p className="mt-1 text-sm text-gray-500">
            IFSC code starts with {INDIAN_BANKS.find(b => b.id === selectedBank)?.ifscPrefix}
          </p>
        )}
      </div>
    </div>
  );
};

export default BankSelect;