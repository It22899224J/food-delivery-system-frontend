import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Search, Filter } from "lucide-react";
import { restaurantApi } from "../api/restaurant";
import Footer from "./Footer";

// Array of dummy restaurant banner images
const dummyBanners = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
];

// Array of dummy restaurant logo images
const dummyLogos = [
  "https://images.unsplash.com/photo-1623259838743-9f1e884fba59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
];

// Function to get a random image from an array
const getRandomImage = (images: string[]) => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

const AllRestaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState<string>("");

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const data = await restaurantApi.getAllRestaurants();

        // Add dummy images to restaurants that don't have them
        const enhancedData = data.map((restaurant: any) => ({
          ...restaurant,
          banner: getRandomImage(dummyBanners),
          logo: getRandomImage(dummyLogos),
        }));

        setRestaurants(enhancedData);
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

  // Filter restaurants based on search term and cuisine
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
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Restaurants</h1>
        <p className="text-gray-600">
          Discover all restaurants available for delivery in your area
        </p>
      </div>

      {/* Filter Section */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
          <div className="text-gray-500">
            {filteredRestaurants.length} restaurants found
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
                  src={restaurant.banner}
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
                    <Star size={16} className="text-yellow-500 mr-1" />
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

export default AllRestaurants;
