import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Search, Filter } from "lucide-react";
import { restaurantApi } from "../api/restaurant";

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState<string>("");
  const [featuredRestaurants, setFeaturedRestaurants] = useState<any[]>([]);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const data = await restaurantApi.getAllRestaurants();
        setRestaurants(data);

        // Set featured restaurants (top 3 by rating)
        const featured = [...data]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        setFeaturedRestaurants(featured);

        setError(null);
      } catch (err) {
        setError("Failed to load restaurants. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  // Get unique cuisines for filter
  const cuisines = [...new Set(restaurants.flatMap((r) => r.cuisineType))];

  // Update the filter to handle cuisineType array
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCuisine =
      cuisineFilter === "" || restaurant.cuisineType.includes(cuisineFilter);
    return matchesSearch && matchesCuisine;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative mb-12 rounded-xl overflow-hidden">
        <div className="h-80 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Delicious Food Delivered To Your Door
            </h1>
            <p className="text-white text-lg md:text-xl mb-8 max-w-2xl">
              Order from your favorite restaurants and enjoy the best meals
              without leaving home
            </p>
            <div className="bg-white p-2 rounded-lg shadow-lg flex items-center max-w-xl">
              <Search className="text-gray-400 ml-2 mr-3" size={20} />
              <input
                type="text"
                placeholder="Search for restaurants or cuisines..."
                className="flex-grow py-2 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Star className="text-gray-800 mr-2" size={24} />
            Featured Restaurants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-gray-800 text-white px-2 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                  <img
                    src={restaurant.banner || restaurant.logo}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <img
                      src={restaurant.logo}
                      alt={`${restaurant.name} logo`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm mr-3"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{restaurant.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {restaurant.cuisineType.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      <span className="truncate max-w-[150px]">
                        {restaurant.address}
                      </span>
                    </div>
                    <div className="flex items-center font-medium text-gray-800">
                      <Star size={16} className="mr-1" />
                      <span>{restaurant.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        restaurant.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {restaurant.isActive ? "Open Now" : "Closed"}
                    </span>
                    <span className="text-gray-800 font-medium">
                      Order Now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">All Restaurants</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search restaurants..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="text-gray-400" size={18} />
              </div>
              <select
                className="pl-10 w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none bg-white"
                value={cuisineFilter}
                onChange={(e) => setCuisineFilter(e.target.value)}
              >
                <option value="">All Cuisines</option>
                {cuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <img
            src="https://img.icons8.com/color/96/000000/nothing-found.png"
            alt="No results"
            className="mx-auto mb-4"
          />
          <p className="text-xl text-gray-500 mb-2">No restaurants found</p>
          <p className="text-gray-500">
            Try a different search term or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurant/${restaurant.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={restaurant.banner || restaurant.logo}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <img
                    src={restaurant.logo}
                    alt={`${restaurant.name} logo`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm mr-3"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {restaurant.cuisineType.join(", ")}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {restaurant.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span className="truncate max-w-[150px]">
                      {restaurant.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center">
                    <Star size={16} className="text-gray-800 mr-1" />
                    <span className="font-medium">{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        restaurant.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {restaurant.isActive ? "Open Now" : "Closed"}
                    </span>
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
