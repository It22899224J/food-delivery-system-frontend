import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { findDeliveryByDriverId, findDriverById, updateDelivery, updateDriverAvailability } from '../../api/delivery';

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
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const fetchDriverAvailability = async () => {
      if (!user?.id) return;
      try {
        const driver = await findDriverById(user.id);
        setIsAvailable(driver.isAvailable);
      } catch (err) {
        console.error('Error fetching driver availability:', err);
        setError('Failed to fetch driver availability status');
      }
    };
    
    fetchDriverAvailability();
  }, [user]);

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

  const handleAvailabilityToggle = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const updatedDriver = await updateDriverAvailability(user.id, !isAvailable);
      setIsAvailable(updatedDriver.isAvailable);
    } catch (err) {
      console.error('Error updating availability:', err);
      setError('Failed to update availability status');
    } finally {
      setLoading(false);
    }
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
      {/* Availability Toggle */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">Driver Dashboard</h1>
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg w-full sm:w-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
              <div className="flex flex-col">
                <span className="text-gray-600 font-medium">Status</span>
                <span className={`text-sm ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                  {isAvailable ? 'Available for Orders' : 'Currently Offline'}
                </span>
              </div>
              <button
                onClick={handleAvailabilityToggle}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  isAvailable ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm ${
                    isAvailable ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <div className="flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Current Delivery Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Truck className="mr-2 text-orange-500" size={28} />
          Current Delivery
        </h2>

        {currentDelivery ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-4 text-lg">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-medium">{currentDelivery.orderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Est. Time</span>
                    <span className="font-medium">{currentDelivery.estimatedTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentDelivery.status)}`}>
                      {currentDelivery.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-4 text-lg">Locations</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <MapPin className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Pickup Location</p>
                      <p className="text-sm text-gray-600">
                        {currentDelivery.startLocation.lat}, {currentDelivery.startLocation.lng}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <MapPin className="text-red-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Delivery Location</p>
                      <p className="text-sm text-gray-600">
                        {currentDelivery.endLocation.lat}, {currentDelivery.endLocation.lng}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
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

                {/* Cancel Button - Enhanced mobile responsiveness */}
                {!['DELIVERED', 'CANCELLED'].includes(currentDelivery.status) && (
                  <div className="pt-8 border-t mt-8">
                    <button
                      onClick={() => handleStatusUpdate('CANCELLED')}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-red-100 text-red-600 rounded-lg 
                      hover:bg-red-200 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Cancel Delivery
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No active deliveries</p>
          </div>
        )}
      </div>

      {/* Delivery History Section - Enhanced for better readability */}
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