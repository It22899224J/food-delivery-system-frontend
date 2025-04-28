import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, DollarSign, Plus, ArrowLeft } from 'lucide-react';
import { fetchRestaurantById, fetchMenuItems } from '../api';
import { Restaurant, MenuItem } from '../types';
import { useCart } from '../context/CartContext';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadRestaurantAndMenu = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const restaurantData = await fetchRestaurantById(id);
        
        if (!restaurantData) {
          setError('Restaurant not found');
          return;
        }
        
        setRestaurant(restaurantData);
        
        const menuData = await fetchMenuItems(id);
        setMenuItems(menuData);
        setError(null);
      } catch (err) {
        setError('Failed to load restaurant details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurantAndMenu();
  }, [id]);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    
    // Show visual feedback
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    
    // Reset after animation
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error || 'Restaurant not found'}</p>
        <button 
          onClick={() => navigate('/')} 
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  return (
    <div>
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-orange-500 mb-4"
      >
        <ArrowLeft size={20} className="mr-1" />
        Back to Restaurants
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-64 overflow-hidden">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-gray-600 mb-4">{restaurant.cuisine}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center">
              <Star size={18} className="text-yellow-500 mr-1" />
              <span>{restaurant.rating}</span>
            </div>
            <div className="flex items-center">
              <Clock size={18} className="text-gray-500 mr-1" />
              <span className="text-gray-500">{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center">
              <DollarSign size={18} className="text-gray-500 mr-1" />
              <span className="text-gray-500">Delivery: ${restaurant.deliveryFee.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Menu</h2>
      
      {menuItems.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No menu items available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map(item => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-1/3 h-32 md:h-auto overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <p className="text-orange-500 font-semibold">${item.price.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => handleAddToCart(item)}
                  className={`mt-2 px-4 py-2 rounded flex items-center justify-center transition-all ${
                    addedItems[item.id] 
                      ? 'bg-green-500 text-white' 
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {addedItems[item.id] ? (
                    'Added to Cart!'
                  ) : (
                    <>
                      <Plus size={16} className="mr-1" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;