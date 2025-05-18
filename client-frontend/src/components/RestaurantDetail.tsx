import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  DollarSign,
  Plus,
  ArrowLeft,
  Tag,
  Leaf,
} from "lucide-react";
import { fetchRestaurantById, fetchMenuItems } from "../api";
import { Restaurant, MenuItem } from "../types";
import { useCart } from "../context/CartContext";
import { restaurantApi } from "../api/restaurant";

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadRestaurantAndMenu = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const restaurantData = await restaurantApi.getRestaurantById(id);

        if (!restaurantData) {
          setError("Restaurant not found");
          return;
        }

        setRestaurant(restaurantData);
        setMenuItems(restaurantData.menuItems || []);
        setError(null);
      } catch (err) {
        setError("Failed to load restaurant details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurantAndMenu();
  }, [id]);

  const dummyBanners = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80",
  ];

  const getRandomImage = (images: string[]) => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const handleAddToCart = (item: any) => {
    addToCart(item);

    // Show visual feedback
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));

    // Reset after animation
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
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
        <p>{error || "Restaurant not found"}</p>
        <button
          onClick={() => navigate("/")}
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
        onClick={() => navigate("/")}
        className="flex items-center text-gray-600 hover:text-orange-500 mb-4"
      >
        <ArrowLeft size={20} className="mr-1" />
        Back to Restaurants
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-64 overflow-hidden">
          <img
            src={restaurant.image || getRandomImage(dummyBanners)}
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
              <span className="text-gray-500">
                {restaurant.deliveryTime || "30-45 min"}
              </span>
            </div>
            <div className="flex items-center">
              <DollarSign size={18} className="text-gray-500 mr-1" />
              <span className="text-gray-500">
                Delivery: LKR {(restaurant.deliveryFee || 2.99).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Menu</h2>

      {menuItems.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No menu items available.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
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
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                    {item.popular && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {item.description}
                  </p>
                  <p className="text-orange-500 font-semibold">
                    LKR {item.price.toFixed(2)}
                  </p>

                  {/* Dietary and Allergies */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.dietary.map((diet: any) => (
                      <span
                        key={diet}
                        className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center"
                      >
                        <Leaf size={12} className="mr-1" />
                        {diet}
                      </span>
                    ))}
                    {item.allergies.map((allergy: any) => (
                      <span
                        key={allergy}
                        className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center"
                      >
                        <Tag size={12} className="mr-1" />
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(item)}
                  className={`mt-3 px-4 py-2 rounded flex items-center justify-center transition-all ${
                    addedItems[item.id]
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {addedItems[item.id] ? (
                    "Added to Cart!"
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
