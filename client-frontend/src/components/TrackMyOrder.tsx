import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { findOrdersByUser } from "../api/order";
import { useAuth } from "../context/AuthContext";
import { Clock, MapPin, ChevronRight } from "lucide-react";
import { restaurantApi } from "../api/restaurant";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
}

const TrackMyOrder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuItemsMap, setMenuItemsMap] = useState<Record<string, MenuItem>>(
    {}
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PREPARING":
        return "bg-blue-100 text-blue-800";
      case "OUT_FOR_DELIVERY":
        return "bg-purple-100 text-purple-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get menu item name
  const getMenuItemName = (itemId: string) => {
    return menuItemsMap[itemId]?.name || `Item ${itemId}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.id) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        // Call API to fetch orders by user ID
        const response = await findOrdersByUser(user.id);

        if (!response) {
          throw new Error("Failed to fetch orders");
        }

        // Get all orders regardless of payment status
        setOrders(response);

        // Fetch menu items for each restaurant
        const restaurantIds = [
          ...new Set(response.map((order) => order.restaurantId)),
        ];
        const menuItemsData: Record<string, MenuItem> = {};

        for (const restaurantId of restaurantIds) {
          try {
            const restaurantData = await restaurantApi.getRestaurantById(
              restaurantId
            );
            if (restaurantData && restaurantData.menuItems) {
              restaurantData.menuItems.forEach((item: MenuItem) => {
                menuItemsData[item.id] = item;
              });
            }
          } catch (err) {
            console.error(
              `Error fetching menu items for restaurant ${restaurantId}:`,
              err
            );
          }
        }

        setMenuItemsMap(menuItemsData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleTrackOrder = (orderId: string, items: any[]) => {
    // Create a serialized version of the order items with their names
    const itemsWithNames = items.map(item => ({
      id: item.id,
      itemId: item.itemId,
      name: getMenuItemName(item.itemId),
      quantity: item.quantity,
      price: item.price
    }));
    
    // Store the items in sessionStorage to access them on the tracking page
    sessionStorage.setItem('trackingOrderItems', JSON.stringify(itemsWithNames));
    
    // Navigate to the tracking page
    navigate(`/tracking/${orderId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-gray-600 hover:text-orange-500 mb-6"
      >
        <ChevronRight size={20} className="mr-1" />
        Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto text-gray-400 mb-4">No orders found</div>
          <h2 className="text-xl font-semibold mb-2">
            You don't have any orders yet
          </h2>
          <p className="text-gray-600 mb-4">
            Start ordering delicious food from our restaurants!
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {order.restaurantName || "Restaurant"}
                      </h2>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <Clock size={16} className="mr-1" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-semibold">
                      LKR 
                      {order.totalAmount?.toFixed(2) || order.total?.toFixed(2)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {order.items &&
                      order.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">
                              {item.quantity}x
                            </span>
                            <span>{getMenuItemName(item.itemId)}</span>
                          </div>
                          <span>
                            LKR {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start">
                      <MapPin
                        size={18}
                        className="mr-2 text-gray-500 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-600 text-sm">
                        {order.deliveryAddress}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => handleTrackOrder(order.id, order.items)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Track My Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackMyOrder;
