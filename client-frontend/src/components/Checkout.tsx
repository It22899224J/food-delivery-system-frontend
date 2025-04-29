import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/order";
import { processCardPayment } from "../api/payment";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.addresses?.[0] || "");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal * 0.1;

  function createLineItems(items: any, deliveryFee: number) {
    const lineItems = items.map(
      (item: {
        name: any;
        description: any;
        images: any[];
        price: number;
        quantity: any;
      }) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description || "No description available",
            images: item.images ? [item.images[0]] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    );

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Fee",
          description: "Standard delivery fee",
        },
        unit_amount: Math.round(deliveryFee * 100),
      },
      quantity: 1,
    });

    return lineItems;
  }

  // Redirect if not authenticated or cart is empty
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (items.length === 0) {
      navigate("/cart");
    }
  }, [isAuthenticated, items, navigate]);

  const [selectedLocation, setSelectedLocation] = useState({
    lat: 6.927079, // Default to Colombo
    lng: 79.861244,
  });

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  function LocationMarker() {
    const map = useMapEvents({
      click(e: any) {
        setSelectedLocation(e.latlng);
      },
    });

    return selectedLocation ? <Marker position={selectedLocation} /> : null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLocation) {
      setError("Please select a delivery location on the map");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Get restaurant info from first item (assuming all items are from same restaurant)
      const restaurantId = items[0]?.restaurantId;
      const restaurantName = items[0]?.name.split(" ")[0]; // Simple way to get restaurant name

      // Convert CartItems to OrderItems
      const orderItems = items.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
        price: item.price,
        specialInstructions: "",
      }));

      const total = subtotal + deliveryFee;

      const orderData = {
        items: orderItems,
        userId: user?.id || "",
        restaurantId,
        restaurantName,
        deliveryFee: deliveryFee,
        deliveryAddress: `${selectedLocation.lat},${selectedLocation.lng}`,
        deliveryInstructions: deliveryInstructions,
        deliveryPersonnelId: "",
        paymentMethod: paymentMethod,
      };

      let order;
      console.log("Payment method", paymentMethod);
      // Handle different payment methods
      if (paymentMethod === "credit_card") {
        try {
          const lineItems = createLineItems(items, deliveryFee);

          const paymentData = {
            lineItems: lineItems,
            successUrl: "http://localhost:5173/order/success",
            cancelUrl: "http://localhost:5173/order/cancel",
          };
          console.log("Payment data:", paymentData);
          // Call the payment processing API
          const paymentResponse = await processCardPayment(paymentData);

          console.log("Payment response:", paymentResponse);
          localStorage.setItem("pendingOrder", JSON.stringify(orderData));
          if (paymentResponse.url != null) {
            window.location.href = paymentResponse.url;
          } else {
            throw new Error(
              paymentResponse.message || "Payment processing failed"
            );
          }
        } catch (paymentError) {
          console.error("Payment processing failed:", paymentError);
          setError("Payment processing failed. Please try again.");
          setIsSubmitting(false);
          return;
        }
      } else {
        // For cash payment, directly create the order
        order = await createOrder(orderData);
      }

      console.log("Order placed:", order);
      // Clear cart and redirect to tracking page
      clearCart();
    } catch (err) {
      console.error("Failed to place order:", err);
      setError("Failed to place your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center text-gray-600 hover:text-orange-500 mb-6"
      >
        <ArrowLeft size={20} className="mr-1" />
        Back to Cart
      </button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin size={20} className="mr-2 text-orange-500" />
                Delivery Address
              </h2>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Select Location on Map
                </label>
                <div style={mapContainerStyle}>
                  <MapContainer
                    center={[selectedLocation.lat, selectedLocation.lng]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker />
                  </MapContainer>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700 mb-2">
                  Selected Location
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={`Lat: ${selectedLocation.lat.toFixed(
                    6
                  )}, Lng: ${selectedLocation.lng.toFixed(6)}`}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="deliveryInstructions"
                  className="block text-gray-700 mb-2"
                >
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  id="deliveryInstructions"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={2}
                  placeholder="Any special instructions for delivery (e.g., Ring doorbell, Leave at door)"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard size={20} className="mr-2 text-orange-500" />
                Payment Method
              </h2>

              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="credit_card"
                    name="payment_method"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={() => setPaymentMethod("credit_card")}
                    className="mr-2"
                  />
                  <label htmlFor="credit_card" className="flex items-center">
                    <CreditCard size={20} className="mr-2" />
                    Card
                  </label>
                </div>

                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="cash"
                    name="payment_method"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="mr-2"
                  />
                  <label htmlFor="cash">Cash on Delivery</label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="max-h-64 overflow-y-auto mb-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2"
                >
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-4 pt-3 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>
                  $
                  {items
                    .reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee (10%)</span>
                <span>
                  $
                  {(
                    items.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    ) * 0.1
                  ).toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    $
                    {(
                      items.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      ) * 1.1
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
