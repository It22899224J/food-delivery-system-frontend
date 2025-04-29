import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import OrderTracking from "./components/OrderTracking";
import Login from "./components/Login";
import DriverDashboard from "./components/driver/DriverDashboard";
import OrderHistory from "./components/OrderHistory";
import Profile from "./components/Profile";

import OrderSuccess from "./components/OrderSuccess";
import AllRestaurants from "./components/AllRestaurants";
import { useAuth } from "./context/AuthContext";
import Register from "./components/Register";
import { useEffect } from "react";

function App() {
  const { isDriver, user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role === "RESTAURANT_ADMIN") {
      window.open("http://localhost:3000", "_blank");
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<RestaurantList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/tracking/:orderId" element={<OrderTracking />} />
          <Route path="/order/success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/all-restaurants" element={<AllRestaurants />} />
          <Route
            path="/driver/dashboard"
            element={
              isDriver ? <DriverDashboard /> : <Navigate to="/driver/login" />
            }
          />
          <Route path="/order-history" element={<OrderHistory />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
