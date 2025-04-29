import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";

// Components
import Navbar from "./components/Navbar";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import OrderTracking from "./components/OrderTracking";
import Login from "./components/Login";
import DriverDashboard from "./components/driver/DriverDashboard";
import DriverLogin from "./components/driver/DriverLogin";
import OrderHistory from "./components/OrderHistory";

// Context
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Types
import { Restaurant, MenuItem } from "./types";
import OrderSuccess from "./components/OrderSuccess";
import AllRestaurants from "./components/AllRestaurants";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDriver, setIsDriver] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<RestaurantList />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/tracking/:orderId" element={<OrderTracking />} />
                <Route path="/order/success" element={<OrderSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/all-restaurants" element={<AllRestaurants />} />
                <Route path="/driver/login" element={<DriverLogin />} />
                <Route
                  path="/driver/dashboard"
                  element={
                    isDriver ? (
                      <DriverDashboard />
                    ) : (
                      <Navigate to="/driver/login" />
                    )
                  }
                />
                <Route path="/order-history" element={<OrderHistory />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
