import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Search, Filter } from "lucide-react";
import { restaurantApi } from "../api/restaurant";
import Footer from "./Footer";

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
    <>
      <div className="m-8">
        <div className="relative mb-8 md:mb-12 rounded-xl overflow-hidden">
          {/* Background Image */}
          <div
            className="h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center"
            style={{
              backgroundImage: `url('https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19744.jpg')`,
            }}
          >
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-16 max-w-6xl mx-auto">
              <div className="space-y-4 md:space-y-6">
                {/* Badge */}
                <span className="px-3 py-1 md:px-4 md:py-1 bg-orange-500 text-white text-xs md:text-sm font-medium rounded-full inline-block">
                  #1 Food Delivery
                </span>

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Delicious Food <br className="hidden md:block" />
                  <span className="text-orange-400">
                    Delivered To Your Door
                  </span>
                </h1>

                {/* Description */}
                <p className="text-gray-200 text-base sm:text-lg md:text-xl max-w-2xl">
                  Order from your favorite restaurants and enjoy the best meals
                  without leaving home
                </p>

                {/* Search Bar */}
                <div className="bg-white p-2 rounded-full shadow-lg flex items-center max-w-xl">
                  <Search
                    className="text-gray-400 ml-2 md:ml-3 mr-1 md:mr-2"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search restaurants or cuisines..."
                    className="flex-grow py-1 md:py-2 text-sm md:text-base outline-none bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-full font-medium transition-colors duration-300">
                    Search
                  </button>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                  {["Pizza", "Burgers", "Italian", "Sushi"].map((cuisine) => (
                    <span
                      key={cuisine}
                      className="px-2 sm:px-3 py-1 bg-white/20 text-white text-xs sm:text-sm rounded-full hover:bg-white/30 cursor-pointer transition-colors"
                      onClick={() => setCuisineFilter(cuisine)}
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
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
                      src={
                        "https://img.freepik.com/premium-photo/chicken-skewers-with-slices-sweet-peppers-dill-tasty-food-weekend-meal_2829-2492.jpg?w=1380"
                      }
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

        <div className="flex flex-col md:flex-row gap-6 mb-12 mt-122">
          {/* Restaurant Partner Banner */}
          <div className="flex-1 relative bg-gray-700 rounded-lg overflow-hidden">
            <div className="p-6 flex flex-col h-full justify-between relative z-10">
              <div>
                <span className="text-white text-sm font-medium">
                  Sign up as a business
                </span>
                <h3 className="text-white text-3xl font-bold mt-2 mb-4">
                  Partner with us
                </h3>
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md w-max transition-colors mt-4">
                Get Started
              </button>
            </div>
            <img
              src="https://img.freepik.com/free-photo/happy-waiter-serving-food-group-cheerful-friends-pub_637285-12525.jpg?t=st=1745912283~exp=1745915883~hmac=c14298d76c4bb6192ef28539b9414fb901a3e718ff49dd24181f9e71af4f1953&w=1380"
              alt="Restaurant partner"
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
            />
          </div>

          {/* Delivery Partner Banner */}
          <div className="flex-1 relative bg-yellow-300 rounded-lg overflow-hidden">
            <div className="p-6 flex flex-col h-full justify-between relative z-10">
              <div>
                <span className="text-gray-800 text-sm font-medium">
                  Sign up as a rider
                </span>
                <h3 className="text-gray-800 text-3xl font-bold mt-2 mb-4">
                  Ride with us
                </h3>
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md w-max transition-colors mt-4">
                Get Started
              </button>
            </div>
            <img
              src="https://img.freepik.com/free-photo/top-view-emotional-proud-ambitious-courier-man-wearing-red-blouse-hat-gloves-medical-mask-sitting-scooter-showing-order_179666-36169.jpg?t=st=1745912347~exp=1745915947~hmac=2b998a12bfb79de6bd54867e296dbc55c2863f9bb6abde4a19928f4b41e79d81&w=1380"
              alt="Delivery partner"
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
            />
          </div>
        </div>

        <div className="bg-orange-500 p-6 rounded-lg mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 text-white">
              <h3 className="text-4xl font-bold mb-1">546+</h3>
              <p className="text-orange-100">Registered Riders</p>
            </div>

            <div className="text-center p-4 text-white">
              <h3 className="text-4xl font-bold mb-1">789,900+</h3>
              <p className="text-orange-100">Orders Delivered</p>
            </div>

            <div className="text-center p-4 text-white">
              <h3 className="text-4xl font-bold mb-1">690+</h3>
              <p className="text-orange-100">Restaurants Partnered</p>
            </div>

            <div className="text-center p-4 text-white">
              <h3 className="text-4xl font-bold mb-1">17,457+</h3>
              <p className="text-orange-100">Food Items</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RestaurantList;
