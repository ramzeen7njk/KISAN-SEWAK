import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Search, Filter, X } from 'lucide-react';
import { supabase } from '../config/supabase';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import { useUser } from '../contexts/UserContext';

const sidebarItems = [
  {
    icon: <Package className="w-5 h-5" />,
    label: 'Products',
    path: '/marketplace/products'
  }
];

interface CropMSP {
  id: string;
  crop_name: string;
  msp_price: number;
}

interface StorageRequest {
  id: string;
  crop_type: string;
  quantity: number;
  storage_facility_id: string;
  storage_facilities: {
    name: string;
  } | null;
}

interface Product {
  crop_type: string;
  crop_name: string;
  total_quantity: number;
  msp: number;
  facilities: {
    id: string;
    name: string;
    quantity: number;
  }[];
}

interface PurchaseModalProps {
  product: Product;
  onClose: () => void;
  onPurchase: (quantity: number, totalCost: number) => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ product, onClose, onPurchase }) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedFacility, setSelectedFacility] = useState<string>(product.facilities[0]?.id || '');

  const calculateTotalCost = (qty: number) => {
    const basePrice = qty * product.msp;
    const transportCharge = basePrice * 0.05; // 5% transport charge
    const gst = (basePrice + transportCharge) * 0.18; // 18% GST
    return basePrice + transportCharge + gst;
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const facility = product.facilities.find(f => f.id === selectedFacility);
    if (facility && value <= facility.quantity) {
      setQuantity(value);
    }
  };

  const handlePurchase = () => {
    if (quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    onPurchase(quantity, calculateTotalCost(quantity));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Purchase {product.crop_name}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Storage Facility
            </label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {product.facilities.map((facility, index) => (
                <option key={`${facility.id}-${index}`} value={facility.id}>
                  {facility.name} ({facility.quantity} kg available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity (kg)
            </label>
            <input
              type="number"
              min="1"
              max={product.facilities.find(f => f.id === selectedFacility)?.quantity || 0}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Price:</span>
              <span>₹{(quantity * product.msp).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transport Charge (5%):</span>
              <span>₹{(quantity * product.msp * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GST (18%):</span>
              <span>₹{((quantity * product.msp * 1.05) * 0.18).toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total Cost:</span>
                <span>₹{calculateTotalCost(quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Confirm Purchase
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const MarketplaceProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    fetchUserDetails();
  }, [user]);

  const fetchUserDetails = async () => {
    if (!user) return;

    try {
      const { data: userData, error } = await supabase
        .from('marketplace_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserDetails(userData);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch storage requests with delivered status
      const { data: storageData, error: storageError } = await supabase
        .from('storage_requests')
        .select(`
          id,
          crop_type,
          quantity,
          storage_facility_id,
          storage_facilities (
            name
          )
        `)
        .eq('logistics_status', 'delivered');

      if (storageError) throw storageError;

      // Fetch MSP data for all crops
      const { data: mspData, error: mspError } = await supabase
        .from('crop_msp')
        .select('*');

      if (mspError) throw mspError;

      // Create a map of crop types to their MSP values and names
      const mspMap = new Map(
        (mspData as CropMSP[])
          .filter(crop => crop && crop.crop_name)
          .map(crop => [
            crop.crop_name.toLowerCase(),
            { msp: crop.msp_price, name: crop.crop_name }
          ])
      );

      // Group storage requests by crop type
      const groupedProducts = new Map<string, Product>();
      
      (storageData as unknown as StorageRequest[])
        .filter(request => request && request.crop_type)
        .forEach(request => {
          const cropType = request.crop_type.toLowerCase();
          const mspInfo = mspMap.get(cropType);
          
          if (!mspInfo) {
            console.warn(`No MSP info found for crop type: ${cropType}`);
            return;
          }

          const existingProduct = groupedProducts.get(cropType);
          const facility = {
            id: request.storage_facility_id,
            name: request.storage_facilities?.name || 'Unknown Facility',
            quantity: request.quantity
          };

          if (existingProduct) {
            existingProduct.total_quantity += request.quantity;
            existingProduct.facilities.push(facility);
          } else {
            groupedProducts.set(cropType, {
              crop_type: request.crop_type,
              crop_name: mspInfo.name,
              total_quantity: request.quantity,
              msp: mspInfo.msp,
              facilities: [facility]
            });
          }
        });

      setProducts(Array.from(groupedProducts.values()));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (quantity: number, totalCost: number) => {
    if (!selectedProduct) {
      console.log('No product selected');
      return;
    }

    try {
      // Calculate charges
      const basePrice = quantity * selectedProduct.msp;
      const transportCharge = basePrice * 0.05; // 5% transport charge
      const gst = (basePrice + transportCharge) * 0.18; // 18% GST

      // Create order in marketplace_orders table
      const { error: orderError } = await supabase
        .from('marketplace_orders')
        .insert([
          {
            marketplace_name: 'Marketplace User',
            crop_type: selectedProduct.crop_type,
            crop_name: selectedProduct.crop_name,
            quantity: quantity,
            base_price: basePrice,
            transport_charge: transportCharge,
            gst: gst,
            total_price: totalCost,
            status: 'pending'
          }
        ]);

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw orderError;
      }

      toast.success('Order placed successfully! You can view it in the Orders tab.');
      setSelectedProduct(null);
      // Refresh the products list
      fetchProducts();
    } catch (error) {
      console.error('Error in handlePurchase:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const filteredProducts = products.filter(product =>
    product.crop_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userType="marketplace"
      userName={userDetails?.company_name || 'Your Company'}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Available Crops</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search crops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <Package className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-800">No Crops Available</h3>
            <p className="text-yellow-600">There are currently no crops available for purchase.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.crop_type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-50 rounded-full">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {product.facilities.length} Storage Facilities
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{product.crop_name}</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Total Available: <span className="font-medium">{product.total_quantity} kg</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    MSP: <span className="font-medium">₹{product.msp}/kg</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Buy Crop
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {selectedProduct && (
          <PurchaseModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onPurchase={handlePurchase}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MarketplaceProducts; 