import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, ArrowLeft, Package, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { findOrdersByUser } from "../api/order";

// Define types for your order data
interface OrderItem {
  id: string;
  itemId: string;
  orderId: string;
  price: number;
  quantity: number;
  specialInstructions: string;
}

interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  restaurantId: string;
  deliveryAddress: string;
  deliveryInstructions: string | null;
  deliveryPersonnelId: string | null;
  items: OrderItem[];
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  statusHistory: any[];
  totalAmount: number;
}

// Dummy restaurant data mapping (to be replaced with actual API call later)
const restaurantDummyData: Record<string, { name: string; image: string }> = {
  "1": {
    name: "Burger Palace",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  },
  "2": {
    name: "Pizza Heaven",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  },
  "3": {
    name: "Sushi Express",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  },
  "4": {
    name: "Taco Fiesta",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  },
  "5": {
    name: "Pasta Paradise",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  },
};

// Dummy item name mapping (to be replaced with actual data later)
const itemDummyData: Record<string, string> = {
  s1: "California Roll",
  s2: "Salmon Nigiri",
  s3: "Miso Soup",
  b1: "Double Cheeseburger",
  b2: "French Fries",
  b3: "Chocolate Milkshake",
  p1: "Pepperoni Pizza",
  p2: "Garlic Bread",
  p3: "Soda",
};

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      case "IN_TRANSIT":
        return "bg-purple-100 text-purple-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get restaurant info from dummy data
  const getRestaurantInfo = (restaurantId: string) => {
    return (
      restaurantDummyData[restaurantId] || {
        name: `Restaurant ${restaurantId}`,
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      }
    );
  };

  // Get item name from dummy data
  const getItemName = (itemId: string) => {
    return itemDummyData[itemId] || `Item ${itemId}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.id) {
        setOrders([]); // No user logged in
        setLoading(false);
        return;
      }

      try {
        console.log("User", user);
        // Call your API to fetch orders by user ID
        const response = await findOrdersByUser(user.id);

        if (!response) {
          throw new Error("Failed to fetch orders");
        }

        console.log("Orders response:", response);
        // Filter orders to only show those with "PAID" payment status
        const paidOrders = response.filter(
          (order) => order.paymentStatus === "PAID"
        );
        setOrders(paidOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
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
        <ArrowLeft size={20} className="mr-1" />
        Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-8">Paid Orders History</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No paid orders yet</h2>
          <p className="text-gray-600 mb-4">
            You don't have any paid orders in your history yet.
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
          {orders.map((order) => {
            const restaurant = getRestaurantInfo(order.restaurantId);

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">
                          {restaurant.name}
                        </h2>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <Clock size={16} className="mr-1" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-semibold">
                        ${order.totalAmount.toFixed(2)}
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
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">
                              {item.quantity}x
                            </span>
                            <span>{getItemName(item.itemId)}</span>
                          </div>
                          <span>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

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

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Payment Method:</span>{" "}
                        {order.paymentMethod === "credit_card"
                          ? "CARD"
                          : order.paymentMethod}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Payment Status:</span>{" "}
                        {order.paymentStatus}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="flex items-center text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      View Details
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
