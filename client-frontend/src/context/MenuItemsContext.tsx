import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { restaurantApi } from "../api/restaurant";

// Define the MenuItem interface based on your API response structure
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  // Add any other properties that your menu items have
}

// Define the context type
interface MenuItemsContextType {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  fetchMenuItems: (restaurantId: string) => Promise<void>;
}

// Create the context with default values
const MenuItemsContext = createContext<MenuItemsContextType>({
  menuItems: [],
  loading: false,
  error: null,
  fetchMenuItems: async () => {},
});

// Custom hook to use the context
export const useMenuItems = () => useContext(MenuItemsContext);

// Custom hook to fetch and manage menu items for a specific restaurant
export const useRestaurantMenuItems = (restaurantId: string) => {
  const { menuItems, loading, error, fetchMenuItems } = useMenuItems();

  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems(restaurantId);
    }
  }, [restaurantId, fetchMenuItems]);

  return {
    menuItems,
    loading,
    error,
  };
};

interface MenuItemsProviderProps {
  children: ReactNode;
}

export const MenuItemsProvider: React.FC<MenuItemsProviderProps> = ({
  children,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async (restaurantId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint
      const response = await restaurantApi.getRestaurantById(restaurantId);

      if (!response.ok) {
        throw new Error(`Failed to fetch restaurant data: ${response.status}`);
      }

      const restaurantData = await response.json();

      // Extract menu items from the restaurant data
      setMenuItems(restaurantData.menuItems || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching menu items:", err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    menuItems,
    loading,
    error,
    fetchMenuItems,
  };

  return (
    <MenuItemsContext.Provider value={value}>
      {children}
    </MenuItemsContext.Provider>
  );
};

export default MenuItemsProvider;
