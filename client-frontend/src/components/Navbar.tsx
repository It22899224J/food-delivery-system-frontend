import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Coffee,
  History,
  Heart,
  Truck,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, isDriver, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg transition-all duration-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 animate-fadeIn">
            <Coffee size={26} className="text-white" />
            <span className="text-2xl font-bold text-white">FoodRush</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 animate-slideDown">
            {isDriver ? (
              <Link
                to="/driver/dashboard"
                className="flex items-center text-white/90 hover:text-gray-300 transition-colors"
              >
                <LayoutDashboard size={18} className="mr-1" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/order-history"
                  className="text-white/90 hover:text-gray-300 transition-colors flex items-center"
                >
                  <History size={18} className="mr-1" /> My Orders
                </Link>
                <Link
                  to="/favorites"
                  className="text-white/90 hover:text-gray-300 transition-colors flex items-center"
                >
                  <Heart size={18} className="mr-1" /> Favorites
                </Link>
                <Link
                  to="/track-order"
                  className="text-white/90 hover:text-gray-300 transition-colors flex items-center"
                >
                  <Truck size={18} className="mr-1" /> Track Order
                </Link>
                <Link
                  to="/cart"
                  className="relative text-white/90 hover:text-gray-300 transition-colors"
                >
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center text-white/90 hover:text-gray-300 transition-colors py-1 px-2 rounded-md">
                  <User size={18} className="mr-2" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10 opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 origin-top-right">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2 text-gray-600" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-white border border-white/30 rounded-md hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/driver/login"
                  className="px-4 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Driver Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {!isDriver && (
              <Link to="/cart" className="relative text-white/90 mr-5">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/90 hover:text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 pt-2 pb-4 shadow-inner animate-slideDown">
          <div className="flex flex-col space-y-3">
            {isDriver ? (
              <Link
                to="/driver/dashboard"
                className="flex items-center text-white/90 hover:text-gray-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard size={18} className="mr-2" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/orders"
                  className="text-white/90 hover:text-gray-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/favorites"
                  className="text-white/90 hover:text-gray-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favorites
                </Link>
                <Link
                  to="/track-order"
                  className="text-white/90 hover:text-gray-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Track Order
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex flex-col border-t border-gray-700 pt-2">
                <div className="py-2 text-white/90 flex items-center">
                  <User size={18} className="inline mr-2" />
                  {user?.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="py-2 text-left text-gray-300 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
                <Link
                  to="/login"
                  className="py-2 text-center text-white border border-white/30 rounded-md hover:bg-white hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/driver/login"
                  className="py-2 text-center bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Driver Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
