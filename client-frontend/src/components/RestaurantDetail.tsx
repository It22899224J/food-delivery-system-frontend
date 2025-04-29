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

        // Instead of fetching menu items, we'll use our dummy data
        const dummyMenuItems = getDummyMenuItems(id);
        setMenuItems(dummyMenuItems);
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

  const getDummyMenuItems = (restaurantId: string): any[] => {
    // Create different menu items based on restaurant ID
    switch (restaurantId) {
      case "cma1o4igb0002l92oy9exshaa":
        return [
          {
            id: "menu1",
            name: "Classic Burger",
            description:
              "Juicy beef patty with lettuce, tomato, and special sauce",
            price: 12.99,
            image: "https://www.unileverfoodsolutions.com.sg/dam/global-ufs/mcos/SEA/calcmenu/recipes/SG-recipes/vegetables-&-vegetable-dishes/%E7%BB%8F%E5%85%B8%E8%8A%9D%E5%A3%AB%E6%B1%89%E5%A0%A1/main-header.jpg",
            categoryId: "burgers",
            available: true,
            popular: true,
            allergies: ["gluten", "dairy"],
            dietary: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            restaurantId: restaurantId,
            quantity: 1,
          },
          {
            id: "menu2",
            name: "Cheese Fries",
            description: "Crispy fries topped with melted cheddar cheese",
            price: 6.99,
            image: "https://media-cldnry.s-nbcnews.com/image/upload/newscms/2024_40/2077804/rick-martinez-cheese-fries-2x1-mc-241004.jpg",
            categoryId: "sides",
            available: true,
            popular: true,
            allergies: ["dairy"],
            dietary: ["vegetarian"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            restaurantId: restaurantId,
            quantity: 1,
          },
          {
            id: "menu3",
            name: "Chocolate Milkshake",
            description: "Rich and creamy chocolate milkshake",
            price: 5.99,
            image: "https://images.contentstack.io/v3/assets/bltcedd8dbd5891265b/bltd2f0b951708bdfce/66707638b76a9292bd908d6f/chocolate-truffle-featured-image.jpg?q=70&width=3840&auto=webp",
            categoryId: "drinks",
            available: true,
            popular: false,
            allergies: ["dairy"],
            dietary: ["vegetarian"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            restaurantId: restaurantId,
            quantity: 1,
          },
          {
            id: "menu4",
            name: "Chicken Tenders",
            description: "Crispy chicken tenders served with dipping sauce",
            price: 9.99,
            image: "https://www.allrecipes.com/thmb/YwJvX75IUx8uQ7PKz2eTDjCoLvY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/16669-fried-chicken-tenders-DDMFS-4x3-219f03b885be40139c8d93bef21d0a50.jpg",
            categoryId: "chicken",
            available: true,
            popular: false,
            allergies: ["gluten"],
            dietary: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            restaurantId: restaurantId,
            quantity: 1,
          },
        ];
      case "cma1n14ab0000l92ogi4oi7ok":
        return [
          {
            id: "menu5",
            name: "Margherita Pizza",
            description:
              "Classic pizza with tomato sauce, mozzarella, and basil",
            price: 14.99,
            image: "https://safrescobaldistatic.blob.core.windows.net/media/2022/11/PIZZA-MARGHERITA.jpg",
            categoryId: "pizza",
            available: true,
            popular: true,
            allergies: ["gluten", "dairy"],
            dietary: ["vegetarian"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            restaurantId: restaurantId,
            quantity: 1,
          },
          {
            id: "menu6",
            name: "Pepperoni Pizza",
            description: "Pizza topped with pepperoni and cheese",
            price: 16.99,
            image: "https://www.perfectitaliano.com.au/content/dam/perfectitaliano-aus/recipe/pepperoni_pizza_standard.jpg",
            categoryId: "pizza",
            available: true,
            popular: true,
            allergies: ["gluten", "dairy"],
            dietary: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            restaurantId: restaurantId,
            quantity: 1,
          },
          {
            id: "menu7",
            name: "Garlic Bread",
            description: "Toasted bread with garlic butter and herbs",
            price: 4.99,
            image: "https://www.spicebangla.com/wp-content/uploads/2020/12/Garlic-Bread.webp",
            categoryId: "sides",
            available: true,
            popular: false,
            allergies: ["gluten", "dairy"],
            dietary: ["vegetarian"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            restaurantId: restaurantId,
            quantity: 1,
          },
          {
            id: "menu8",
            name: "Caesar Salad",
            description:
              "Fresh romaine lettuce with Caesar dressing and croutons",
            price: 8.99,
            image: "https://img.taste.com.au/Wl3qdnK8/taste/2016/11/chicken-caesar-salad-83105-1.jpeg",
            categoryId: "salads",
            available: true,
            popular: false,
            allergies: ["gluten", "dairy", "eggs"],
            dietary: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            restaurantId: restaurantId,
            quantity: 1,
          },
        ];
      case "cma1o34zc0001l92o88qx5rer":
        return [
          {
            id: "menu9",
            name: "Pad Thai",
            description:
              "Stir-fried rice noodles with eggs, tofu, bean sprouts, and peanuts",
            price: 13.99,
            image: "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/k%2FPhoto%2FRecipes%2F2024-04-pad-thai-190%2Fpad-thai-190-251",
            categoryId: "noodles",
            available: true,
            popular: true,
            allergies: ["peanuts", "eggs"],
            dietary: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            restaurantId: restaurantId,
            quantity: 1,
          },
          {
            id: "menu10",
            name: "Green Curry",
            description:
              "Spicy Thai curry with coconut milk, vegetables, and choice of protein",
            price: 15.99,
            image: "https://i0.wp.com/fortheloveofgourmet.com/wp-content/uploads/2019/06/DSC_0709.jpg?fit=3008%2C2000&ssl=1",
            categoryId: "curry",
            available: true,
            popular: true,
            allergies: [],
            dietary: ["gluten-free"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            restaurantId: restaurantId,
            quantity: 1,
          },
          {
            id: "menu11",
            name: "Spring Rolls",
            description:
              "Fresh vegetables wrapped in rice paper with dipping sauce",
            price: 7.99,
            image: "https://simpletoscratch.com/wp-content/uploads/2020/05/spring-rolls-11.jpg",
            categoryId: "appetizers",
            available: true,
            popular: false,
            allergies: [],
            dietary: ["vegetarian", "gluten-free"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            restaurantId: restaurantId,
            quantity: 1,
          },
          {
            id: "menu12",
            name: "Mango Sticky Rice",
            description: "Sweet sticky rice with fresh mango and coconut milk",
            price: 6.99,
            image: "https://kunyitpepper.com/wp-content/uploads/2025/02/Authentic-Butterfly-Pea-Mango-Sticky-Rice.webp",
            categoryId: "desserts",
            available: true,
            popular: false,
            allergies: [],
            dietary: ["vegetarian", "gluten-free"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            restaurantId: restaurantId,
            quantity: 1,
          },
        ];
      default:
        return [
          {
            id: "default1",
            name: "Sample Dish",
            description: "This is a sample menu item",
            price: 9.99,
            image: "https://www.thespruceeats.com/thmb/NKrzAkVokEycHnVDEX6vi8Hg3RQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/creamy-tomato-pasta-481963-Hero-5b6afcf6c9e77c0050e73162.jpg",
            categoryId: "default",
            available: true,
            popular: false,
            allergies: [],
            dietary: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            restaurantId: restaurantId,
            quantity: 1,
          },
        ];
    }
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
            src={restaurant.image || "https://images.ctfassets.net/awb1we50v0om/6tE2cm5qXWYZqMSNmJ8olk/7f9291c8d27a45b9cdef60e5965e43a1/Recipe2.jpg?w=1920&fm=webp&q=70"}
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
                Delivery: ${(restaurant.deliveryFee || 2.99).toFixed(2)}
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
                    ${item.price.toFixed(2)}
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
