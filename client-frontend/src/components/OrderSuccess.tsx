import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createOrder } from "../api/order";
import { CheckCircle, Package, Home } from "lucide-react";
import { useCart } from "../context/CartContext";

const OrderSuccess: React.FC = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    const callApi = async () => {
      try {
        const orderDataString = localStorage.getItem("pendingOrder");

        if (!orderDataString) {
          console.error("No pending order found in local storage.");
          setError("No order information found.");
          setLoading(false);
          return;
        }

        const orderData = JSON.parse(orderDataString);

        const newOrderData = {
          ...orderData,
          paymentStatus: "PAID",
        };

        const response = await createOrder(newOrderData);
        console.log("API Response:", response);

        // Save the order ID for tracking
        if (response && response.id) {
          setOrderId(response.id);
        }

        // If successful, clear the pendingOrder from localStorage
        localStorage.removeItem("pendingOrder");
        console.log("Pending order removed from localStorage.");
        clearCart();
        setLoading(false);
      } catch (error) {
        console.error("Error calling API:", error);
        setError("There was a problem processing your order.");
        setLoading(false);
      }
    };

    callApi();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Order Error
          </h1>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <Link
              to="/"
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-md"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-50 to-amber-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
          {orderId && (
            <p className="text-sm text-gray-500 mt-2">
              Order ID: {orderId.substring(0, 8)}...
            </p>
          )}
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center p-3 bg-orange-50 rounded-lg">
            <Package className="text-orange-500 mr-3" size={24} />
            <div>
              <h3 className="font-medium text-gray-800">
                Preparing Your Order
              </h3>
              <p className="text-sm text-gray-600">
                Our restaurant is preparing your delicious meal
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <Home className="text-blue-500 mr-3" size={24} />
            <div>
              <h3 className="font-medium text-gray-800">Delivery On The Way</h3>
              <p className="text-sm text-gray-600">
                Your food will be delivered to your address soon
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          {orderId && (
            <Link
              to={`/tracking/${orderId}`}
              className="w-full py-3 bg-orange-500 text-white text-center rounded-lg hover:bg-orange-600 transition-colors shadow-md flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Track Your Order
            </Link>
          )}

          <Link
            to="/"
            className="w-full py-3 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
