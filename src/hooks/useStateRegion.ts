import { useState, useEffect } from 'react';
import { State, City, getStates, getCities } from '../data/indianStates';

export const useStateRegion = () => {
  const [states, setStates] = useState<State[]>([]);
  const [regions, setRegions] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  useEffect(() => {
    // Get all states on component mount
    setStates(getStates());
  }, []);

  useEffect(() => {
    if (selectedState) {
      // Get cities/regions for selected state
      setRegions(getCities(selectedState));
      setSelectedRegion('');
    } else {
      setRegions([]);
      setSelectedRegion('');
    }
  }, [selectedState]);

  return {
    states,
    regions,
    selectedState,
    selectedRegion,
    setSelectedState,
    setSelectedRegion,
  };
}; 