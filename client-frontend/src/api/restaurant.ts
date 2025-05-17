import api from './axios';

const API_BASE_URL = "http://localhost:8089/restaurants"; 

export const foodItemApi = {
  // Create a new food item
  createFoodItem: async (foodItemData: any, image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    // Append other food item data
    Object.keys(foodItemData).forEach((key) => {
      formData.append(key, foodItemData[key].toString());
    });

    const response = await api.post(`${API_BASE_URL}/food-items`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get all food items
  getAllFoodItems: async () => {
    const response = await api.get(`${API_BASE_URL}/food-items`);
    return response.data;
  },

  // Get a single food item by ID
  getFoodItemById: async (id: string) => {
    const response = await api.get(`${API_BASE_URL}/food-items/${id}`);
    return response.data;
  },

  // Update a food item
  updateFoodItem: async (id: string, updateData: any, image?: File) => {
    const formData = new FormData();

    if (image) {
      formData.append("image", image);
    }

    // Append other food item data
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        formData.append(key, updateData[key].toString());
      }
    });

    const response = await api.put(
      `${API_BASE_URL}/food-items/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Delete a food item
  deleteFoodItem: async (id: string) => {
    const response = await api.delete(`${API_BASE_URL}/food-items/${id}`);
    return response.data;
  },
};

export const restaurantApi = {
  // Create a new restaurant
  createRestaurant: async (restaurantData: any) => {
    const response = await api.post(`${API_BASE_URL}/restaurants`, restaurantData);
    return response.data;
  },

  // Get all restaurants
  getAllRestaurants: async () => {
    const response = await api.get(`${API_BASE_URL}/restaurants`);
    return response.data;
  },

  // Get a single restaurant by ID
  getRestaurantById: async (id: string) => {
    const response = await api.get(`${API_BASE_URL}/restaurants/${id}`);
    return response.data;
  },

  // Update a restaurant
  updateRestaurant: async (id: string, updateData: any) => {
    const response = await api.put(
      `${API_BASE_URL}/restaurants/${id}`,
      updateData
    );
    return response.data;
  },

  // Delete a restaurant
  deleteRestaurant: async (id: string) => {
    const response = await api.delete(`${API_BASE_URL}/restaurants/${id}`);
    return response.data;
  },
};


