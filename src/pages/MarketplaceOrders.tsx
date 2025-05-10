import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Filter, MoreVertical, CreditCard, Trash2, X } from 'lucide-react';
import { supabase } from '../config/supabase';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';

const sidebarItems = [
  {
    icon: <Package className="w-5 h-5" />,
    label: 'Orders',
    path: '/marketplace/orders'
  }
];

interface Order {
  id: string;
  marketplace_name: string;
  crop_type: string;
  crop_name: string;
  quantity: number;
  base_price: number;
  transport_charge: number;
  gst: number;
  total_price: number;
  status: string;
  created_at: string;
}

interface PaymentModalProps {
  order: Order;
  onClose: () => void;
  onPaymentComplete: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ order, onClose, onPaymentComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
      toast.success('Payment completed successfully!');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Payment Details</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Order Summary</h4>
            <div className="space-y-2">
              <p className="text-sm">Crop: {order.crop_name}</p>
              <p className="text-sm">Quantity: {order.quantity} kg</p>
              <p className="text-sm">Total Amount: ₹{order.total_price}</p>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Marketplace Bank Details</h4>
              <div className="space-y-1 text-sm">
                <p>Bank: State Bank of India</p>
                <p>Account Number: 1234567890</p>
                <p>IFSC Code: SBIN0001234</p>
                <p>Account Name: Kisan Sewak Marketplace</p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Admin Bank Details</h4>
              <div className="space-y-1 text-sm">
                <p>Bank: HDFC Bank</p>
                <p>Account Number: 0987654321</p>
                <p>IFSC Code: HDFC0005678</p>
                <p>Account Name: Kisan Sewak Admin</p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay Now</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const MarketplaceOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marketplace_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.crop_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('marketplace_orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Order removed successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error removing order:', error);
      toast.error('Failed to remove order');
    }
  };

  const handlePaymentComplete = async () => {
    if (!selectedOrder) return;

    try {
      // Update only the status in the marketplace_orders table
      const { error } = await supabase
        .from('marketplace_orders')
        .update({ 
          status: 'completed'
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      setShowPaymentModal(false);
      setSelectedOrder(null);
      fetchOrders();
      toast.success('Payment completed successfully!');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    }
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userType="marketplace"
      userName="Marketplace User"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Your Orders</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders..."
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
        ) : filteredOrders.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <Package className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-800">No Orders Found</h3>
            <p className="text-yellow-600">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-50 rounded-full">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    {order.status === 'pending' && (
                      <div className="relative">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        {selectedOrder?.id === order.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-10">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowPaymentModal(true);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <CreditCard className="w-4 h-4" />
                              <span>Pay Now</span>
                            </button>
                            <button
                              onClick={() => handleRemoveOrder(order.id)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 flex items-center space-x-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Remove Order</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{order.crop_name}</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Quantity: <span className="font-medium">{order.quantity} kg</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Base Price: <span className="font-medium">₹{order.base_price}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Transport Charge: <span className="font-medium">₹{order.transport_charge}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    GST: <span className="font-medium">₹{order.gst}</span>
                  </p>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-sm font-medium text-gray-800">
                      Total Price: <span className="text-green-600">₹{order.total_price}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Ordered on: {new Date(order.created_at).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {showPaymentModal && selectedOrder && (
          <PaymentModal
            order={selectedOrder}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedOrder(null);
            }}
            onPaymentComplete={handlePaymentComplete}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MarketplaceOrders; 