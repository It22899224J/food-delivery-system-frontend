import { Restaurant, MenuItem, Order } from "../types";

// Mock data for restaurants
const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Burger Palace",
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    cuisine: "American",
    rating: 4.5,
    deliveryTime: "20-30 min",
    deliveryFee: 2.99,
  },
  {
    id: "2",
    name: "Pizza Heaven",
    image: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
    cuisine: "Italian",
    rating: 4.7,
    deliveryTime: "25-35 min",
    deliveryFee: 3.5,
  },
  {
    id: "3",
    name: "Sushi Express",
    image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg",
    cuisine: "Japanese",
    rating: 4.8,
    deliveryTime: "30-40 min",
    deliveryFee: 4.99,
  },
  {
    id: "4",
    name: "Taco Fiesta",
    image: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg",
    cuisine: "Mexican",
    rating: 4.3,
    deliveryTime: "15-25 min",
    deliveryFee: 2.5,
  },
  {
    id: "5",
    name: "Curry House",
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
    cuisine: "Indian",
    rating: 4.6,
    deliveryTime: "30-45 min",
    deliveryFee: 3.99,
  },
];

// Mock data for menu items
const menuItems: MenuItem[] = [
  // Burger Palace menu
  {
    id: "b1",
    name: "Classic Cheeseburger",
    description: "Beef patty with cheese, lettuce, tomato, and special sauce",
    price: 8.99,
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    restaurantId: "1",
  },
  {
    id: "b2",
    name: "Bacon Deluxe Burger",
    description: "Beef patty with bacon, cheese, lettuce, tomato, and mayo",
    price: 10.99,
    image: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg",
    restaurantId: "1",
  },
  {
    id: "b3",
    name: "Veggie Burger",
    description: "Plant-based patty with lettuce, tomato, and vegan mayo",
    price: 9.99,
    image: "https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg",
    restaurantId: "1",
  },

  // Pizza Heaven menu
  {
    id: "p1",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    image: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
    restaurantId: "2",
  },
  {
    id: "p2",
    name: "Pepperoni Pizza",
    description: "Pizza with tomato sauce, mozzarella, and pepperoni",
    price: 14.99,
    image: "https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg",
    restaurantId: "2",
  },
  {
    id: "p3",
    name: "Vegetarian Pizza",
    description: "Pizza with tomato sauce, mozzarella, and assorted vegetables",
    price: 13.99,
    image: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg",
    restaurantId: "2",
  },

  // Sushi Express menu
  {
    id: "s1",
    name: "California Roll",
    description: "Crab, avocado, and cucumber wrapped in seaweed and rice",
    price: 7.99,
    image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg",
    restaurantId: "3",
  },
  {
    id: "s2",
    name: "Salmon Nigiri",
    description: "Fresh salmon over pressed rice",
    price: 8.99,
    image: "https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg",
    restaurantId: "3",
  },
  {
    id: "s3",
    name: "Dragon Roll",
    description: "Eel, crab, and cucumber topped with avocado",
    price: 12.99,
    image: "https://images.pexels.com/photos/2133989/pexels-photo-2133989.jpeg",
    restaurantId: "3",
  },

  // Taco Fiesta menu
  {
    id: "t1",
    name: "Beef Taco",
    description:
      "Seasoned ground beef with lettuce, cheese, and salsa in a corn tortilla",
    price: 3.99,
    image: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg",
    restaurantId: "4",
  },
  {
    id: "t2",
    name: "Chicken Quesadilla",
    description: "Grilled chicken and cheese in a flour tortilla",
    price: 7.99,
    image: "https://images.pexels.com/photos/6605208/pexels-photo-6605208.jpeg",
    restaurantId: "4",
  },
  {
    id: "t3",
    name: "Veggie Burrito",
    description:
      "Rice, beans, lettuce, cheese, and salsa wrapped in a flour tortilla",
    price: 8.99,
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
    restaurantId: "4",
  },

  // Curry House menu
  {
    id: "c1",
    name: "Chicken Tikka Masala",
    description: "Grilled chicken in a creamy tomato sauce with spices",
    price: 14.99,
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
    restaurantId: "5",
  },
  {
    id: "c2",
    name: "Vegetable Biryani",
    description: "Basmati rice cooked with mixed vegetables and spices",
    price: 12.99,
    image: "https://images.pexels.com/photos/7437748/pexels-photo-7437748.jpeg",
    restaurantId: "5",
  },
  {
    id: "c3",
    name: "Butter Naan",
    description: "Soft flatbread brushed with butter",
    price: 2.99,
    image: "https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg",
    restaurantId: "5",
  },
];

// Mock orders
let orders: Order[] = [];

// API functions
export const fetchRestaurants = (): Promise<Restaurant[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(restaurants);
    }, 500);
  });
};

export const fetchRestaurantById = (
  id: string
): Promise<Restaurant | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const restaurant = restaurants.find((r) => r.id === id);
      resolve(restaurant);
    }, 300);
  });
};

export const fetchMenuItems = (restaurantId: string): Promise<MenuItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items = menuItems.filter(
        (item) => item.restaurantId === restaurantId
      );
      resolve(items);
    }, 300);
  });
};

export const fetchOrderById = (orderId: string): Promise<Order | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = orders.find((o) => o.id === orderId);
      resolve(order);
    }, 300);
  });
};

export const updateOrderStatus = (
  orderId: string,
  status: Order["status"],
  driverId?: string
): Promise<Order | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderIndex = orders.findIndex((o) => o.id === orderId);

      if (orderIndex !== -1) {
        orders[orderIndex] = {
          ...orders[orderIndex],
          status,
          ...(driverId && { driverId }),
          ...(status === "ON_THE_WAY" && {
            estimatedDeliveryTime: new Date(
              Date.now() + 30 * 60000
            ).toISOString(),
          }),
        };

        resolve(orders[orderIndex]);
      } else {
        resolve(undefined);
      }
    }, 500);
  });
};

export const fetchAvailableOrders = (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const availableOrders = orders.filter(
        (o) => o.status === "CONFIRMED" || o.status === "PREPARING"
      );
      resolve(availableOrders);
    }, 500);
  });
};

export const fetchDriverOrders = (driverId: string): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const driverOrders = orders.filter((o) => o.driverId === driverId);
      resolve(driverOrders);
    }, 500);
  });
};
