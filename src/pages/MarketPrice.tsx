import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';

const MarketPrice = () => {
  const [cropType, setCropType] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [pricePerKg, setPricePerKg] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const handleCalculateEarnings = () => {
    if (quantity <= 0 || pricePerKg <= 0) {
      toast.error('Please enter valid quantity and price.');
      return;
    }
    const earnings = quantity * pricePerKg;
    setTotalEarnings(earnings);
  };

  // Sample data for the line graph
  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Potential Earnings',
        data: [totalEarnings, totalEarnings * 1.1, totalEarnings * 1.2, totalEarnings * 1.3],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Market Price</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Crop Type"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="number"
          placeholder="Quantity (kg)"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price per kg"
          value={pricePerKg}
          onChange={(e) => setPricePerKg(Number(e.target.value))}
          className="p-2 border rounded"
        />
      </div>
      <button
        onClick={handleCalculateEarnings}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Calculate Earnings
      </button>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Total Earnings: ₹{totalEarnings}</h3>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Earnings Over Time</h3>
        <Line data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default MarketPrice;
