import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, DollarSign } from 'lucide-react';
import { fetchRestaurants } from '../api';
import { Restaurant } from '../types';

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState<string>('');

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const data = await fetchRestaurants();
        setRestaurants(data);
        setError(null);
      } catch (err) {
        setError('Failed to load restaurants. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  // Get unique cuisines for filter
  const cuisines = [...new Set(restaurants.map(r => r.cuisine))];

  // Filter restaurants based on search term and cuisine
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = cuisineFilter === '' || restaurant.cuisine === cuisineFilter;
    return matchesSearch && matchesCuisine;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search restaurants..."
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
          >
            <option value="">All Cuisines</option>
            {cuisines.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No restaurants found. Try a different search term or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <Link 
              key={restaurant.id} 
              to={`/restaurant/${restaurant.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 mr-1" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="text-gray-500 mr-1" />
                    <span className="text-gray-500">{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-gray-500 mr-1" />
                    <span className="text-gray-500">${restaurant.deliveryFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;