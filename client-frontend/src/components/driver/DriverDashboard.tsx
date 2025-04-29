import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Package, Truck, CheckCircle, AlertCircle, Navigation } from 'lucide-react';
import { findDeliveryByDriverId, findDriverById, updateDelivery, updateDriverAvailability } from '../../api/delivery';
import { updateOrderStatus } from '../../api/order';

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

  interface LocationName {
    pickup: string;
    delivery: string;
  }
  
  const [locationNames, setLocationNames] = useState<LocationName>({
    pickup: '',
    delivery: ''
  });
  
  const getLocationName = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FoodDeliverySystem/1.0' // Required by Nominatim's terms of use
          }
        }
      );
      const data = await response.json();
      return data.display_name || `${lat}, ${lng}`;
    } catch (error) {
      console.error('Error fetching location name:', error);
      return `${lat}, ${lng}`;
    }
  };
  
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
  
        // Fetch location names
        const pickup = await getLocationName(active.startLocation.lat, active.startLocation.lng);
        const delivery = await getLocationName(active.endLocation.lat, active.endLocation.lng);
        setLocationNames({ pickup, delivery });
      } else {
        setCurrentDelivery(null);
        setLocationNames({ pickup: '', delivery: '' });
      }
    } catch (err) {
      console.error('Error fetching current delivery:', err);
      setError('Failed to fetch current delivery');
    }
  };

  const [historyLocationNames, setHistoryLocationNames] = useState<Record<string, LocationName>>({});

  const fetchDeliveryHistory = async () => {
    try {
      const response = await findDeliveryByDriverId(user?.id || '');
      const deliveries = Array.isArray(response) ? response : [response];
      
      const history = deliveries
        .filter(d => ['DELIVERED', 'CANCELLED'].includes(d.status))
        .sort((a, b) => new Date(b.assignedAt || '').getTime() - new Date(a.assignedAt || '').getTime());
      
      // Fetch location names for each delivery
      const locationPromises = history.map(async (delivery) => {
        const pickup = await getLocationName(delivery.startLocation.lat, delivery.startLocation.lng);
        const dropoff = await getLocationName(delivery.endLocation.lat, delivery.endLocation.lng);
        return [delivery.id, { pickup, delivery: dropoff }];
      });
  
      const locationResults = await Promise.all(locationPromises);
      const locationMap = Object.fromEntries(locationResults);
      setHistoryLocationNames(locationMap);
      
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
      
      // Map delivery status to order status
      let orderStatus;
      switch (newStatus) {
        case 'PICKED_UP':
          orderStatus = 'ON_THE_WAY';  // Changed from READY_FOR_PICKUP to ON_THE_WAY
          break;
        case 'IN_TRANSIT':
          orderStatus = 'ON_THE_WAY';
          break;
        case 'DELIVERED':
          orderStatus = 'DELIVERED';
          break;
        case 'CANCELLED':
          orderStatus = 'CANCELLED';
          break;
        default:
          orderStatus = 'PREPARING';
      }

      // Call both APIs to update delivery and order status
      const [updatedDelivery] = await Promise.all([
        updateDelivery(currentDelivery.id, {
          status: newStatus,
          ...(newStatus === 'PICKED_UP' && { pickedUpAt: new Date().toISOString() }),
          ...(newStatus === 'DELIVERED' && { deliveredAt: new Date().toISOString() }),
        }),
        updateOrderStatus(currentDelivery.orderId, { status: orderStatus, changedBy: user?.id || '' }),
      ]);

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
      PENDING: 'bg-amber-50 text-amber-700',
      ASSIGNED: 'bg-sky-50 text-sky-700',
      PICKED_UP: 'bg-violet-50 text-violet-700',
      IN_TRANSIT: 'bg-indigo-50 text-indigo-700',
      DELIVERED: 'bg-emerald-50 text-emerald-700',
      CANCELLED: 'bg-rose-50 text-rose-700',
    };
    return colors[status] || 'bg-slate-50 text-slate-700';
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
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 hover:shadow-xl transition-shadow border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-slate-800">Driver Dashboard</h1>
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg w-full sm:w-auto border border-slate-100">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
              <div className="flex flex-col">
                <span className="text-slate-600 font-medium">Status</span>
                <span className={`text-sm ${isAvailable ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {isAvailable ? 'Available for Orders' : 'Currently Offline'}
                </span>
              </div>
              <button
                onClick={handleAvailabilityToggle}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                  isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
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
        <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-lg mb-8">
          <div className="flex items-center">
            <AlertCircle className="mr-2 flex-shrink-0" size={20} />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Current Delivery Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 hover:shadow-xl transition-shadow border border-slate-100">
        <h2 className="text-2xl font-semibold mb-6 flex items-center text-slate-800">
          <Truck className="mr-2 text-sky-500" size={28} />
          Current Delivery
        </h2>

        {currentDelivery ? (
          <div className="space-y-8">
            {/* Order Details and Location Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Details Card */}
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 hover:border-sky-200 transition-colors">
                <h3 className="font-medium text-slate-800 mb-4 text-lg flex items-center">
                  <Package className="mr-2 text-sky-500" size={20} />
                  Order Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-600">Order ID</span>
                    <span className="font-medium text-slate-800">{currentDelivery.orderId}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-600">Est. Time</span>
                    <span className="font-medium text-slate-800">{currentDelivery.estimatedTime} min</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentDelivery.status)}`}>
                      {currentDelivery.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Locations Card */}
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 hover:border-sky-200 transition-colors">
                <h3 className="font-medium text-slate-800 mb-4 text-lg flex items-center">
                  <MapPin className="mr-2 text-sky-500" size={20} />
                  Locations
                </h3>
                <div className="space-y-6">
                  <div className="p-4 bg-white rounded-lg border border-slate-100">
                    <div className="flex items-start">
                      <div className="bg-emerald-50 p-2 rounded-full mr-3">
                        <MapPin className="text-emerald-600" size={20} />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-slate-800">Pickup Location</p>
                        <p className="text-sm text-slate-600 mb-3">
                          {locationNames.pickup || `${currentDelivery.startLocation.lat}, ${currentDelivery.startLocation.lng}`}
                        </p>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${currentDelivery.startLocation.lat},${currentDelivery.startLocation.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center px-4 py-2 bg-sky-500 text-white rounded-lg 
                          hover:bg-sky-600 transition-all duration-200 gap-2 text-sm font-medium shadow-sm hover:shadow-md 
                          active:transform active:scale-95"
                        >
                          <Navigation className="w-4 h-4" />
                          Navigate to Pickup
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-slate-100">
                    <div className="flex items-start">
                      <div className="bg-rose-50 p-2 rounded-full mr-3">
                        <MapPin className="text-rose-600" size={20} />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-slate-800">Delivery Location</p>
                        <p className="text-sm text-slate-600 mb-3">
                          {locationNames.delivery || `${currentDelivery.endLocation.lat}, ${currentDelivery.endLocation.lng}`}
                        </p>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${currentDelivery.endLocation.lat},${currentDelivery.endLocation.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-500 text-white rounded-lg 
                          hover:bg-indigo-600 transition-all duration-200 gap-2 text-sm font-medium shadow-sm hover:shadow-md 
                          active:transform active:scale-95"
                        >
                          <Navigation className="w-4 h-4" />
                          Navigate to Delivery
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Progress */}
            <div className="border-t border-slate-200 pt-8">
              <h3 className="font-medium text-slate-800 mb-6 text-lg flex items-center">
                <Truck className="mr-2 text-sky-500" size={20} />
                Delivery Progress
              </h3>
              <div className="relative">
                <div className="absolute left-8 top-0 h-full w-0.5 bg-slate-200"></div>
                
                {/* Progress Steps */}
                <div className="space-y-8">
                  {/* Pickup Step */}
                  <div className="relative flex items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      currentDelivery.status === 'ASSIGNED'
                        ? 'bg-sky-50 text-sky-600'
                        : currentDelivery.status === 'PICKED_UP' || currentDelivery.status === 'IN_TRANSIT' || currentDelivery.status === 'DELIVERED'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Package size={24} />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium text-slate-800">Pick up Order</h4>
                      <p className="text-sm text-slate-500">Collect order from restaurant</p>
                      {currentDelivery.status === 'ASSIGNED' && (
                        <button
                          onClick={() => handleStatusUpdate('PICKED_UP')}
                          className="mt-3 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 
                          transition-colors text-sm font-medium shadow-sm hover:shadow-md active:transform active:scale-95"
                        >
                          Confirm Pickup
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Start Delivery Step */}
                  <div className="relative flex items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      currentDelivery.status === 'PICKED_UP'
                        ? 'bg-sky-50 text-sky-600'
                        : currentDelivery.status === 'IN_TRANSIT' || currentDelivery.status === 'DELIVERED'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Truck size={24} />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium text-slate-800">Start Delivery</h4>
                      <p className="text-sm text-slate-500">Begin the delivery journey</p>
                      {currentDelivery.status === 'PICKED_UP' && (
                        <button
                          onClick={() => handleStatusUpdate('IN_TRANSIT')}
                          className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 
                          transition-colors text-sm font-medium shadow-sm hover:shadow-md active:transform active:scale-95"
                        >
                          Start Delivery
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Complete Delivery Step */}
                  <div className="relative flex items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      currentDelivery.status === 'IN_TRANSIT'
                        ? 'bg-sky-50 text-sky-600'
                        : currentDelivery.status === 'DELIVERED'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      <CheckCircle size={24} />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium text-slate-800">Complete Delivery</h4>
                      <p className="text-sm text-slate-500">Hand over order to customer</p>
                      {currentDelivery.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => handleStatusUpdate('DELIVERED')}
                          className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                          transition-colors text-sm font-medium shadow-sm hover:shadow-md active:transform active:scale-95"
                        >
                          Complete Delivery
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancel Button */}
              {!['DELIVERED', 'CANCELLED'].includes(currentDelivery.status) && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    className="w-full sm:w-auto px-6 py-3 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 
                    transition-colors font-medium flex items-center justify-center gap-2 border border-rose-200"
                  >
                    <AlertCircle className="w-5 h-5" />
                    Cancel Delivery
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <Package size={64} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 text-lg">No active deliveries</p>
          </div>
        )}
      </div>

      {/* Delivery History Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-slate-100">
        <h2 className="text-2xl font-semibold mb-6 flex items-center text-slate-800">
          <CheckCircle className="mr-2 text-sky-500" size={24} />
          Delivery History
        </h2>

        {deliveryHistory.length > 0 ? (
          <div className="space-y-6">
            {deliveryHistory.map((delivery) => (
              <div key={delivery.id} className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <div className="flex flex-col gap-6">
                  {/* Order Details */}
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-slate-800 text-lg">Order #{delivery.orderId}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                        <span className="text-sm text-slate-500">
                          {delivery.deliveredAt && `Delivered at ${formatDateTime(delivery.deliveredAt)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                
                  {/* Locations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pickup Location */}
                    <div className="p-4 bg-white rounded-lg border border-slate-100">
                      <div className="flex items-start">
                        <div className="bg-emerald-50 p-2 rounded-full mr-3">
                          <MapPin className="text-emerald-600" size={20} />
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium text-slate-800">Pickup Location</p>
                          <p className="text-sm text-slate-600 mb-3">
                            {historyLocationNames[delivery.id]?.pickup || 
                              `${delivery.startLocation.lat}, ${delivery.startLocation.lng}`}
                          </p>
                        </div>
                      </div>
                    </div>
                
                    {/* Delivery Location */}
                    <div className="p-4 bg-white rounded-lg border border-slate-100">
                      <div className="flex items-start">
                        <div className="bg-rose-50 p-2 rounded-full mr-3">
                          <MapPin className="text-rose-600" size={20} />
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium text-slate-800">Delivery Location</p>
                          <p className="text-sm text-slate-600 mb-3">
                            {historyLocationNames[delivery.id]?.delivery || 
                              `${delivery.endLocation.lat}, ${delivery.endLocation.lng}`}
                          </p>
                        </div>
                      </div>
                    </div>
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