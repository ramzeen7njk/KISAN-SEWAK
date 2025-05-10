import React from 'react';
import { useStateRegion } from '../hooks/useStateRegion';
import { State, City } from '../data/indianStates';

interface StateRegionSelectProps {
  onStateChange: (state: string) => void;
  onRegionChange: (region: string) => void;
  stateError?: string;
  regionError?: string;
  className?: string;
}

const StateRegionSelect: React.FC<StateRegionSelectProps> = ({
  onStateChange,
  onRegionChange,
  stateError,
  regionError,
  className = ''
}) => {
  const { states, regions, selectedState, selectedRegion, setSelectedState, setSelectedRegion } = useStateRegion();

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    onStateChange(newState);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegion = e.target.value;
    setSelectedRegion(newRegion);
    onRegionChange(newRegion);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
        <select
          value={selectedState}
          onChange={handleStateChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select your state</option>
          {states.map((state) => (
            <option key={state.id} value={state.name}>
              {state.name}
            </option>
          ))}
        </select>
        {stateError && <p className="mt-1 text-sm text-red-600">{stateError}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          disabled={!selectedState}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
        >
          <option value="">Select your region</option>
          {regions.map((region) => (
            <option key={region.id} value={region.name}>
              {region.name}
            </option>
          ))}
        </select>
        {regionError && <p className="mt-1 text-sm text-red-600">{regionError}</p>}
      </div>
    </div>
  );
};

export default StateRegionSelect; 