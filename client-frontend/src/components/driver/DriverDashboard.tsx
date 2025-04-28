import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Package, CheckCircle, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchAvailableOrders, fetchDriverOrders, updateOrderStatus } from '../../api';
import { Order } from '../../types';

const DriverDashboard: React.FC = () => {
  const { user, isAuthenticated, isDriver, updateDriverAvailability } = useAuth();
  const navigate = useNavigate();
  
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated as driver
  useEffect(() => {
    if (!isAuthenticated || !isDriver) {
      navigate('/driver/login');
    }
  }, [isAuthenticated, isDriver, navigate]);

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Load available orders
        const availableOrdersData = await fetchAvailableOrders();
        setAvailableOrders(availableOrdersData);
        
        // Load driver's orders
        const driverOrdersData = await fetchDriverOrders(user.id);
        setMyOrders(driverOrdersData);
        
        setError(null);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  const handleToggleAvailability = () => {
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability);
    updateDriverAvailability(newAvailability);
  };

  const handleAcceptOrder = async (order: Order) => {
    if (!user) return;
    
    try {
      const updatedOrder = await updateOrderStatus(order.id, 'out_for_delivery', user.id);
      
      if (updatedOrder) {
        // Remove from available orders
        setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
        
        // Add to my orders
        setMyOrders(prev => [...prev, updatedOrder]);
      }
    } catch (err) {
      console.error('Failed to accept order:', err);
      setError('Failed to accept order. Please try again.');
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, 'delivered');
      
      if (updatedOrder) {
        // Update order in my orders list
        setMyOrders(prev => 
          prev.map(o => o.id === orderId ? updatedOrder : o)
        );
      }
    } catch (err) {
      console.error('Failed to complete order:', err);
      setError('Failed to mark order as delivered. Please try again.');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && !availableOrders.length && !myOrders.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Driver Dashboard</h1>
        
        <button 
          onClick={handleToggleAvailability}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            isAvailable 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
          }`}
        >
          {isAvailable ? (
            <>
              <ToggleRight size={20} className="mr-2" />
              Available for Deliveries
            </>
          ) : (
            <>
              <ToggleLeft size={20} className="mr-2" />
              Unavailable
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Active Deliveries */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My Active Deliveries</h2>
          
          {myOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">You don't have any active deliveries</p>
              {isAvailable ? (
                <p className="text-gray-500 mt-2">Accept orders from the available list</p>
              ) : (
                <p className="text-gray-500 mt-2">Set yourself as available to accept orders</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{order.restaurantName}</h3>
                      <p className="text-sm text-gray-500">Order #{order.id.substring(order.id.length - 6)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {order.status === 'out_for_delivery' ? 'In Progress' : 'Delivered'}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-start mb-2">
                      <MapPin size={18} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{order.deliveryAddress}</p>
                    </div>
                    <div className="flex items-center">
                      <Clock size={18} className="text-gray-500 mr-2" />
                      <p className="text-gray-700">
                        {order.estimatedDeliveryTime 
                          ? `Deliver by ${formatTime(order.estimatedDeliveryTime)}` 
                          : 'Delivery time not set'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="text-sm mb-2">
                      <span className="font-medium">Items:</span>{' '}
                      {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                    </div>
                    
                    {order.status === 'out_for_delivery' && (
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center justify-center"
                      >
                        <CheckCircle size={18} className="mr-2" />
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Orders */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Orders</h2>
          
          {!isAvailable ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <X size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">You're currently unavailable</p>
              <p className="text-gray-500 mt-2">Set yourself as available to see orders</p>
            </div>
          ) : availableOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No available orders at the moment</p>
              <p className="text-gray-500 mt-2">Check back soon</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{order.restaurantName}</h3>
                      <p className="text-sm text-gray-500">Order #{order.id.substring(order.id.length - 6)}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {order.status === 'confirmed' ? 'New' : 'Preparing'}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-start mb-2">
                      <MapPin size={18} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{order.deliveryAddress}</p>
                    </div>
                    <div className="flex items-center">
                      <Clock size={18} className="text-gray-500 mr-2" />
                      <p className="text-gray-700">Ordered at {formatTime(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{order.items.length} items</span>
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                    </div>
                    
                    <button
                      onClick={() => handleAcceptOrder(order)}
                      className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                    >
                      Accept Delivery
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;