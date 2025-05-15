import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  History,
  Heart,
  Truck,
  Search,
  Tag,
  Store,
  MapPin,
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
    <nav className="bg-white text-gray-900 shadow-lg transition-all duration-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 animate-fadeIn">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900">Order</span>
              <div className="bg-orange-500 px-2 py-1 rounded">
                <span className="text-3xl font-bold text-white">LK</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 animate-slideDown">
            {isDriver ? (
              <Link
                to="/driver/dashboard"
                className="flex items-center text-gray-900 hover:text-orange-500 transition-colors px-4 py-2"
              >
                <LayoutDashboard size={18} className="mr-1" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/browse-menu"
                  className="text-gray-900 hover:text-orange-500 transition-colors px-4 py-2 flex items-center"
                >
                  <Search size={18} className="mr-1" />
                  Browse Menu
                </Link>
                <Link
                  to="/special-offers"
                  className="text-gray-900 hover:text-orange-500 transition-colors px-4 py-2 flex items-center"
                >
                  <Tag size={18} className="mr-1" />
                  Special Offers
                </Link>
                <Link
                  to="/all-restaurants"
                  className="text-gray-900 hover:text-orange-500 transition-colors px-4 py-2 flex items-center"
                >
                  <Store size={18} className="mr-1" />
                  Restaurants
                </Link>
                <Link
                  to="/order-history"
                  className="text-gray-900 hover:text-orange-500 transition-colors px-4 py-2 flex items-center"
                >
                  <History size={18} className="mr-1" />
                  My Orders
                </Link>
                <Link
                  to="/track-order"
                  className="text-gray-900 hover:text-orange-500 transition-colors px-4 py-2 flex items-center"
                >
                  <MapPin size={18} className="mr-1" />
                  Track Order
                </Link>
                <Link
                  to="/cart"
                  className="relative text-gray-900 hover:text-orange-500 transition-colors ml-2"
                >
                  <ShoppingCart size={22} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center text-gray-900 hover:text-orange-500 transition-colors py-1 px-2 rounded-md">
                  <User size={18} className="mr-2" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10 opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 origin-top-right">
                  <Link
                    to="/profile"
                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} className="mr-2 text-gray-600" />
                    Profile
                  </Link>
                  <Link
                    to="/order-history"
                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <History size={16} className="mr-2 text-gray-600" />
                    My Orders
                  </Link>
                  <Link
                    to="/favorites"
                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart size={16} className="mr-2 text-gray-600" />
                    Favorites
                  </Link>
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
                  className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center">
                    <User size={18} className="mr-2" />
                    Login/Signup
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {!isDriver && (
              <Link to="/cart" className="relative text-gray-900 mr-5">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-900 hover:text-orange-500 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-inner animate-slideDown">
          <div className="flex flex-col space-y-3">
            {isDriver ? (
              <Link
                to="/driver/dashboard"
                className="flex items-center text-gray-900 hover:text-orange-500 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard size={18} className="mr-2" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/browse-menu"
                  className="text-gray-900 hover:text-orange-500 py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Search size={18} className="mr-2" />
                  Browse Menu
                </Link>
                <Link
                  to="/special-offers"
                  className="text-gray-900 hover:text-orange-500 py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Tag size={18} className="mr-2" />
                  Special Offers
                </Link>
                <Link
                  to="/all-restaurants"
                  className="text-gray-900 hover:text-orange-500 py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Store size={18} className="mr-2" />
                  Restaurants
                </Link>
                <Link
                  to="/order-history"
                  className="text-gray-900 hover:text-orange-500 py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <History size={18} className="mr-2" />
                  My Orders
                </Link>
                <Link
                  to="/track-order"
                  className="text-gray-900 hover:text-orange-500 py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MapPin size={18} className="mr-2" />
                  Track Order
                </Link>
                <Link
                  to="/favorites"
                  className="text-gray-900 hover:text-orange-500 py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart size={16} className="mr-2" />
                  Favorites
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex flex-col border-t border-gray-200 pt-2">
                <div className="py-2 text-gray-900 flex items-center">
                  <User size={18} className="inline mr-2" />
                  {user?.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="py-2 text-left text-gray-700 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <Link
                  to="/login"
                  className="py-2 text-center bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center justify-center">
                    <User size={18} className="mr-2" />
                    Login/Signup
                  </div>
                </Link>
                <Link
                  to="/driver/login"
                  className="py-2 text-center border border-gray-900 text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center justify-center">
                    <Truck size={18} className="mr-2" />
                    Driver Login
                  </div>
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
