import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal * 0.1;

  //HANDLE CHECKOUT
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <ShoppingBag size={64} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">
          Add items from restaurants to get started
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  // Group items by restaurant
  const itemsByRestaurant: Record<string, typeof items> = {};
  let restaurantName = "";

  items.forEach((item) => {
    if (!itemsByRestaurant[item.restaurantId]) {
      itemsByRestaurant[item.restaurantId] = [];
    }
    itemsByRestaurant[item.restaurantId].push(item);
    restaurantName = item.name.split(" ")[0]; // Just a simple way to get restaurant name
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-orange-500"
        >
          <ArrowLeft size={20} className="mr-1" />
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {Object.entries(itemsByRestaurant).map(
            ([restaurantId, restaurantItems]) => (
              <div
                key={restaurantId}
                className="bg-white rounded-lg shadow-md p-6 mb-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{restaurantName}</h2>
                  <Link
                    to={`/restaurant/${restaurantId}`}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    Add more items
                  </Link>
                </div>

                <div className="divide-y">
                  {restaurantItems.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 flex flex-col sm:flex-row"
                    >
                      <div className="sm:w-24 h-24 mb-4 sm:mb-0 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="sm:ml-4 flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-gray-500 text-sm mb-2">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="mx-3">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-600"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${(subtotal + deliveryFee).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 mt-3 text-red-500 hover:text-red-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
