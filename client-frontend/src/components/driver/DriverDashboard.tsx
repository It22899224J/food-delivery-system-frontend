import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';

// Types
interface Delivery {
  id: string;
  orderId: string;
  status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
  currentLocation?: { lat: number; lng: number };
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

  useEffect(() => {
    if (!user) return;
    
    // Fetch current delivery and history
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API calls
        const mockCurrentDelivery = {
          id: '1',
          orderId: 'ORD123',
          status: 'ASSIGNED',
          startLocation: { lat: 6.927079, lng: 79.861244 },
          endLocation: { lat: 6.847487, lng: 79.923756 },
          estimatedTime: 30,
          assignedAt: new Date().toISOString(),
        } as Delivery;

        const mockHistory = [
          {
            id: '2',
            orderId: 'ORD122',
            status: 'DELIVERED',
            startLocation: { lat: 6.927079, lng: 79.861244 },
            endLocation: { lat: 6.847487, lng: 79.923756 },
            estimatedTime: 25,
            assignedAt: '2024-03-15T10:00:00Z',
            deliveredAt: '2024-03-15T10:30:00Z',
          },
          // Add more mock history items as needed
        ];

        setCurrentDelivery(mockCurrentDelivery);
        setDeliveryHistory(mockHistory);
      } catch (err) {
        setError('Failed to fetch delivery information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [user]);

  const handleStatusUpdate = async (newStatus: Delivery['status']) => {
    if (!currentDelivery) return;

    try {
      // TODO: Replace with actual API call
      const updatedDelivery = {
        ...currentDelivery,
        status: newStatus,
        ...(newStatus === 'PICKED_UP' && { pickedUpAt: new Date().toISOString() }),
        ...(newStatus === 'DELIVERED' && { deliveredAt: new Date().toISOString() }),
      };

      setCurrentDelivery(updatedDelivery);
      // Show success message
    } catch (err) {
      setError('Failed to update delivery status');
      console.error(err);
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
              <h3 className="font-medium text-gray-700 mb-4">Update Status</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatusUpdate('PICKED_UP')}
                  disabled={currentDelivery.status !== 'ASSIGNED'}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Picked Up
                </button>
                <button
                  onClick={() => handleStatusUpdate('IN_TRANSIT')}
                  disabled={currentDelivery.status !== 'PICKED_UP'}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Delivery
                </button>
                <button
                  onClick={() => handleStatusUpdate('DELIVERED')}
                  disabled={currentDelivery.status !== 'IN_TRANSIT'}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Delivered
                </button>
                <button
                  onClick={() => handleStatusUpdate('CANCELLED')}
                  disabled={['DELIVERED', 'CANCELLED'].includes(currentDelivery.status)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel Delivery
                </button>
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