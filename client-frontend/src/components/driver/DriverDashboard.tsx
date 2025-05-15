import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { findDeliveryByDriverId, updateDelivery } from '../../api/delivery';

// Types
interface Delivery {
  id: string;
  orderId: string;
  status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
  location?: { lat: number; lng: number };
  estimatedTime: number;
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentDelivery, setCurrentDelivery] = useState<Delivery | null>(null);
  const [deliveryHistory, setDeliveryHistory] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentDelivery = async () => {
    try {
      const response = await findDeliveryByDriverId(user?.id || '');
      const deliveries = Array.isArray(response) ? response : [response];
      
      const active = deliveries.find(d => 
        !['DELIVERED', 'CANCELLED'].includes(d.status)
      );
      
      console.log('Active Delivery:', active);
      
      if (active) {
        setCurrentDelivery({
          ...active,
          estimatedTime: active.estimatedTime || 30
        });
      } else {
        setCurrentDelivery(null);
      }
    } catch (err) {
      console.error('Error fetching current delivery:', err);
      setError('Failed to fetch current delivery');
    }
  };

  const fetchDeliveryHistory = async () => {
    try {
      const response = await findDeliveryByDriverId(user?.id || '');
      const deliveries = Array.isArray(response) ? response : [response];
      
      const history = deliveries
        .filter(d => ['DELIVERED', 'CANCELLED'].includes(d.status))
        .sort((a, b) => new Date(b.assignedAt || '').getTime() - new Date(a.assignedAt || '').getTime());
      
      console.log('Delivery History:', history);
      
      setDeliveryHistory(history.map(delivery => ({
        ...delivery,
        estimatedTime: delivery.estimatedTime || 30
      })));
    } catch (err) {
      console.error('Error fetching delivery history:', err);
      setError('Failed to fetch delivery history');
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchCurrentDelivery(),
          fetchDeliveryHistory()
        ]);
        setError(null);
      } catch (err) {
        setError('Failed to fetch delivery information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleStatusUpdate = async (newStatus: Delivery['status']) => {
    if (!currentDelivery) return;

    try {
      setLoading(true);
      
      // Call the API to update delivery status
      const updatedDelivery = await updateDelivery(currentDelivery.id, {
        status: newStatus,
        ...(newStatus === 'PICKED_UP' && { pickedUpAt: new Date().toISOString() }),
        ...(newStatus === 'DELIVERED' && { deliveredAt: new Date().toISOString() }),
      });

      setCurrentDelivery({
        ...updatedDelivery,
        estimatedTime: updatedDelivery.estimatedTime || 30
      });
      
      // Refresh the deliveries list
      await fetchCurrentDelivery();
      await fetchDeliveryHistory();
    } catch (err) {
      setError('Failed to update delivery status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Delivery['status']) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ASSIGNED: 'bg-blue-100 text-blue-800',
      PICKED_UP: 'bg-purple-100 text-purple-800',
      IN_TRANSIT: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Driver Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Current Delivery Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Truck className="mr-2" size={24} />
          Current Delivery
        </h2>

        {currentDelivery ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-gray-700 mb-2">Order Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2">Order ID: {currentDelivery.orderId}</p>
                  <p className="mb-2">
                    Estimated Time: {currentDelivery.estimatedTime} minutes
                  </p>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(currentDelivery.status)}`}>
                    {currentDelivery.status}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-700 mb-2">Locations</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start mb-2">
                    <MapPin className="mr-2 mt-1 text-green-500" size={18} />
                    <div>
                      <p className="font-medium">Pickup Location</p>
                      <p className="text-sm text-gray-600">
                        {currentDelivery.startLocation.lat}, {currentDelivery.startLocation.lng}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="mr-2 mt-1 text-red-500" size={18} />
                    <div>
                      <p className="font-medium">Delivery Location</p>
                      <p className="text-sm text-gray-600">
                        {currentDelivery.endLocation.lat}, {currentDelivery.endLocation.lng}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-700 mb-4">Delivery Progress</h3>
              <div className="flex flex-col space-y-4">
                {/* Status Timeline */}
                <div className="relative">
                  <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200"></div>
                  
                  {/* Pickup Status */}
                  <div className="relative flex items-center mb-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      currentDelivery.status === 'ASSIGNED' 
                        ? 'bg-blue-100 text-blue-600' 
                        : currentDelivery.status === 'PICKED_UP' || currentDelivery.status === 'IN_TRANSIT' || currentDelivery.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Package size={24} />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium">Pick up Order</h4>
                      <p className="text-sm text-gray-500">Collect order from restaurant</p>
                      {currentDelivery.status === 'ASSIGNED' && (
                        <button
                          onClick={() => handleStatusUpdate('PICKED_UP')}
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors"
                        >
                          Confirm Pickup
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Start Delivery Status */}
                  <div className="relative flex items-center mb-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      currentDelivery.status === 'PICKED_UP'
                        ? 'bg-blue-100 text-blue-600'
                        : currentDelivery.status === 'IN_TRANSIT' || currentDelivery.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Truck size={24} />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium">Start Delivery</h4>
                      <p className="text-sm text-gray-500">Begin the delivery journey</p>
                      {currentDelivery.status === 'PICKED_UP' && (
                        <button
                          onClick={() => handleStatusUpdate('IN_TRANSIT')}
                          className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm transition-colors"
                        >
                          Start Delivery
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Complete Delivery Status */}
                  <div className="relative flex items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      currentDelivery.status === 'IN_TRANSIT'
                        ? 'bg-blue-100 text-blue-600'
                        : currentDelivery.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <CheckCircle size={24} />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium">Complete Delivery</h4>
                      <p className="text-sm text-gray-500">Hand over order to customer</p>
                      {currentDelivery.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => handleStatusUpdate('DELIVERED')}
                          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                        >
                          Complete Delivery
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cancel Button - Always at bottom */}
                {!['DELIVERED', 'CANCELLED'].includes(currentDelivery.status) && (
                  <div className="pt-4 border-t mt-4">
                    <button
                      onClick={() => handleStatusUpdate('CANCELLED')}
                      className="w-full md:w-auto px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Cancel Delivery
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No active deliveries</p>
          </div>
        )}
      </div>

      {/* Delivery History Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <CheckCircle className="mr-2" size={24} />
          Delivery History
        </h2>

        {deliveryHistory.length > 0 ? (
          <div className="divide-y">
            {deliveryHistory.map((delivery) => (
              <div key={delivery.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="font-medium">Order #{delivery.orderId}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {delivery.deliveredAt && `Delivered at ${formatDateTime(delivery.deliveredAt)}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Pickup: {delivery.startLocation.lat}, {delivery.startLocation.lng}</p>
                    <p>Dropoff: {delivery.endLocation.lat}, {delivery.endLocation.lng}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No delivery history available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;