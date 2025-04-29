import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Utensils,
  Truck,
  Home,
  MapPin,
} from "lucide-react";
import { findOrderById } from "../api/order";

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const orderData = await findOrderById(orderId);

        if (!orderData) {
          setError("Order not found");
          return;
        }
        console.log(orderData);
        setOrder(orderData);
        setError(null);

        // Poll for updates every 10 seconds
        const interval = setInterval(async () => {
          const updatedOrder = await findOrderById(orderId);
          if (updatedOrder) {
            setOrder(updatedOrder);

            // Stop polling if order is delivered
            if (updatedOrder.status === "DELIVERED") {
              clearInterval(interval);
            }
          }
        }, 10000);

        return () => clearInterval(interval);
      } catch (err) {
        setError("Failed to load order details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const getStatusStep = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "preparing":
        return 2;
      case "out_for_delivery":
        return 3;
      case "delivered":
        return 4;
      default:
        return 0;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatCoordinates = (coords: string) => {
    // If it's a valid coordinate string, you might want to display it differently
    // or integrate with a map service
    if (coords && coords.includes(",")) {
      return "Location coordinates available";
    }
    return coords || "No address provided";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error || "Order not found"}</p>
        <Link
          to="/"
          className="mt-4 inline-block px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Order Tracking</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Restaurant Order</h2>
            <p className="text-gray-500">
              Order #{order.id.substring(order.id.length - 6)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">
              Ordered at {formatTime(order.createdAt)}
            </p>
            <p className="text-gray-500">
              Payment: {order.paymentMethod.toUpperCase()} (
              {order.paymentStatus})
            </p>
          </div>
        </div>

        <div className="relative mb-8">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 transition-all duration-500"
            style={{ width: `${currentStep * 25}%` }}
          ></div>

          <div className="relative flex justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  currentStep >= 1
                    ? "bg-orange-500 text-white"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                <CheckCircle size={16} />
              </div>
              <span className="mt-2 text-sm text-center">Confirmed</span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  currentStep >= 2
                    ? "bg-orange-500 text-white"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                <Utensils size={16} />
              </div>
              <span className="mt-2 text-sm text-center">Preparing</span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  currentStep >= 3
                    ? "bg-orange-500 text-white"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                <Truck size={16} />
              </div>
              <span className="mt-2 text-sm text-center">On the way</span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  currentStep >= 4
                    ? "bg-orange-500 text-white"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                <Home size={16} />
              </div>
              <span className="mt-2 text-sm text-center">Delivered</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2 flex items-center">
            <MapPin size={18} className="mr-2 text-orange-500" />
            Delivery Address
          </h3>
          <p className="text-gray-700">
            {formatCoordinates(order.deliveryAddress)}
          </p>
          {order.deliveryInstructions && (
            <p className="text-gray-600 mt-1">
              <span className="font-medium">Instructions:</span>{" "}
              {order.deliveryInstructions}
            </p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Order Items</h3>
          <div className="space-y-2">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name || item.itemId}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Order More Food
        </Link>
      </div>
    </div>
  );
};

export default OrderTracking;
