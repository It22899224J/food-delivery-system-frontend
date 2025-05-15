import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Driver, RegisterDriverData, RegisterUserData } from "../types";
import { authApi } from "../api/auth";
import { createDriver } from "../api/delivery";
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDriver: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    userData: RegisterUserData | RegisterDriverData
  ) => Promise<boolean>;
  logout: () => void;
  updateDriverAvailability: (isAvailable: boolean) => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  deleteProfile: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDriver, setIsDriver] = useState(false);

   const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000); // in seconds
      return payload.exp && payload.exp > currentTime;
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      if (!isTokenValid(token)) {
        console.warn("Token expired or invalid. Logging out...");
        logout(); // invalidate session
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsDriver(parsedUser.role === "DRIVER");
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        logout();
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Call the login API
      const response = await authApi.login(email, password);

      // Check if login was successful
      if (!response || !response.token) {
        console.error("Login failed: Invalid response from server");
        return false;
      }

      // Store token in localStorage for subsequent API calls
      localStorage.setItem("token", response.token);

      // Decode the JWT token to get user information
      // The token is in format: header.payload.signature
      // We need the payload part which is the second part
      try {
        const tokenParts = response.token.split(".");
        if (tokenParts.length !== 3) {
          throw new Error("Invalid token format");
        }

        // Decode the base64 payload
        const payload = JSON.parse(atob(tokenParts[1]));

        // Create user object from token payload
        const loggedInUser: User = {
          id: payload.id.toString(),
          name: payload.name,
          email: payload.email,
          role: payload.role,
          contact: payload.contact || "",
          address: payload.address || "",
        };

        // Update state
        setUser(loggedInUser);
        setIsAuthenticated(true);
        setIsDriver(payload.role === "DRIVER");
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("token", JSON.stringify(response.token));

        return true;
      } catch (error) {
        console.error("Failed to decode token:", error);
        throw error;
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (
    userData: RegisterUserData | RegisterDriverData
  ): Promise<boolean> => {
    try {
      const response = await authApi.register(userData);
      if(userData.role === "DRIVER"){
        // Get current location using Geolocation API
        const location = await new Promise<{lat: number, lng: number}>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            (error) => {
              console.error('Error getting location:', error);
              // Fallback to default location if geolocation fails
              resolve({
                lat: 6.937567543517343,
                lng: 79.94650308629167
              });
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          );
        });

        const response2 = await createDriver({
          id: response.user.id.toString(),
          name: userData.name,
          email: userData.email,
          vehicleType: (userData as RegisterDriverData).vehicleType,
          licensePlate: (userData as RegisterDriverData).licensePlate,
          contact: userData.contact,
          isAvailable: true,
          location: location
        });

        console.log(response2);

        if (!response2.name || !response2.email) {
          throw new Error(response?.message || "Registration failed");
        }
      }

      if (!response || !response.user) {
        throw new Error(response?.message || "Registration failed");
      }

      const registeredUser = response.user;

      if (userData.role === "DRIVER") {
        const driverUser: Driver = {
          id: registeredUser.id.toString(),
          name: registeredUser.name,
          email: registeredUser.email,
          role: "DRIVER",
          address: registeredUser.address,
          contact: registeredUser.contact,
          isAvailable: true,
          licensePlate: (userData as RegisterDriverData).licensePlate,
          vehicleType: (userData as RegisterDriverData).vehicleType,
        };

        setUser(driverUser);
        setIsAuthenticated(true);
        setIsDriver(true);
        localStorage.setItem("user", JSON.stringify(driverUser));
      } else {
        const customerUser: User = {
          id: registeredUser.id.toString(),
          name: registeredUser.name,
          email: registeredUser.email,
          role: registeredUser.role,
          address: registeredUser.address,
          contact: registeredUser.contact,
        };

        setUser(customerUser);
        setIsAuthenticated(true);
        setIsDriver(false);
        localStorage.setItem("user", JSON.stringify(customerUser));
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Registration failed:", error.message);
      } else {
        console.error("Registration failed:", error);
      }
      throw error; // Propagate error to component for proper error handling
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsDriver(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Also remove the token
  };

  const updateDriverAvailability = (isAvailable: boolean) => {
    if (user && user.role === "DRIVER") {
      const updatedUser = { ...user, isAvailable } as Driver;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Call the API to update user profile
      const response = await authApi.updateUser(user.id, userData);
      
      if (!response || !response.user) {
        throw new Error(response?.message || "Profile update failed");
      }
      
      // Update the user in state and localStorage
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error("Profile update failed:", error);
      return false;
    }
  };

  const deleteProfile = async (): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Call the API to delete user profile
      await authApi.deleteUser(user.id);

      // Log out the user
      logout();
      
      return true;
    } catch (error) {
      console.error("Profile deletion failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isDriver,
        login,
        register,
        logout,
        updateDriverAvailability,
        updateProfile,
        deleteProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
