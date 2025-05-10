import React, { useState } from 'react';
import { CROP_CATEGORIES, CropCategory, Crop } from '../data/cropsList';
import { X } from 'lucide-react';

interface CropSelectProps {
  onCropChange: (crops: string[]) => void;
  error?: string;
}

const CropSelect: React.FC<CropSelectProps> = ({ onCropChange, error }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>([]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleCropToggle = (cropName: string) => {
    const newSelectedCrops = selectedCrops.includes(cropName)
      ? selectedCrops.filter(crop => crop !== cropName)
      : [...selectedCrops, cropName];
    
    setSelectedCrops(newSelectedCrops);
    onCropChange(newSelectedCrops);
  };

  const handleVarietyToggle = (variety: string) => {
    const newSelectedVarieties = selectedVarieties.includes(variety)
      ? selectedVarieties.filter(v => v !== variety)
      : [...selectedVarieties, variety];
    
    setSelectedVarieties(newSelectedVarieties);
    onCropChange([...selectedCrops, ...newSelectedVarieties]);
  };

  const handleRemoveItem = (item: string) => {
    setSelectedCrops(selectedCrops.filter(crop => crop !== item));
    setSelectedVarieties(selectedVarieties.filter(variety => variety !== item));
    onCropChange([
      ...selectedCrops.filter(crop => crop !== item),
      ...selectedVarieties.filter(variety => variety !== item)
    ]);
  };

  const currentCategory = CROP_CATEGORIES.find(cat => cat.id === selectedCategory);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Crop Category
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {CROP_CATEGORIES.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {currentCategory && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Crops
            </label>
            <div className="grid grid-cols-2 gap-2">
              {currentCategory.crops.map(crop => (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => handleCropToggle(crop.name)}
                  className={`p-2 text-sm rounded-lg border ${
                    selectedCrops.includes(crop.name)
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {crop.name}
                </button>
              ))}
            </div>
          </div>

          {selectedCrops.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Varieties
              </label>
              <div className="grid grid-cols-2 gap-2">
                {currentCategory.crops
                  .filter(crop => selectedCrops.includes(crop.name))
                  .map(crop =>
                    crop.varieties.map(variety => (
                      <button
                        key={variety}
                        type="button"
                        onClick={() => handleVarietyToggle(variety)}
                        className={`p-2 text-sm rounded-lg border ${
                          selectedVarieties.includes(variety)
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {variety}
                      </button>
                    ))
                  )}
              </div>
            </div>
          )}
        </div>
      )}

      {(selectedCrops.length > 0 || selectedVarieties.length > 0) && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected Crops & Varieties
          </label>
          <div className="flex flex-wrap gap-2">
            {[...selectedCrops, ...selectedVarieties].map(item => (
              <span
                key={item}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item)}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X size={14} className="text-green-700" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CropSelect; 