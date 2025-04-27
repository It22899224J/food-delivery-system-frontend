import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, isDriver, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-orange-500">
            FoodDelivery
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isDriver ? (
              <Link to="/driver/dashboard" className="text-gray-700 hover:text-orange-500">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/" className="text-gray-700 hover:text-orange-500">
                  Restaurants
                </Link>
                <Link to="/cart" className="relative text-gray-700 hover:text-orange-500">
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-orange-500">
                  <User size={20} className="mr-1" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-orange-500 border border-orange-500 rounded hover:bg-orange-500 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/driver/login"
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  Driver Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {!isDriver && (
              <Link to="/cart" className="relative text-gray-700 mr-4">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-orange-500 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-md">
          <div className="flex flex-col space-y-3">
            {isDriver ? (
              <Link 
                to="/driver/dashboard" 
                className="text-gray-700 hover:text-orange-500 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/" 
                className="text-gray-700 hover:text-orange-500 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Restaurants
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex flex-col">
                <div className="py-2 text-gray-700">
                  <User size={20} className="inline mr-2" />
                  {user?.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="py-2 text-left text-red-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="py-2 text-center text-orange-500 border border-orange-500 rounded hover:bg-orange-500 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/driver/login"
                  className="py-2 text-center text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
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