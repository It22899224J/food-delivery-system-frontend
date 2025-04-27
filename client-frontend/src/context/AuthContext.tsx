import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Driver } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDriver: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  driverLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateDriverAvailability: (isAvailable: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDriver, setIsDriver] = useState(false);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setIsDriver(parsedUser.role === 'driver');
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: email,
        role: 'customer',
        addresses: ['123 Main St, City, Country']
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      setIsDriver(false);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const driverLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      const mockDriver: Driver = {
        id: '2',
        name: 'Driver User',
        email: email,
        role: 'driver',
        isAvailable: true,
        currentOrders: [],
        completedOrders: [],
        phone: '555-123-4567'
      };

      setUser(mockDriver);
      setIsAuthenticated(true);
      setIsDriver(true);
      localStorage.setItem('user', JSON.stringify(mockDriver));
      return true;
    } catch (error) {
      console.error('Driver login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsDriver(false);
    localStorage.removeItem('user');
  };

  const updateDriverAvailability = (isAvailable: boolean) => {
    if (user && user.role === 'driver') {
      const updatedUser = { ...user, isAvailable } as Driver;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isDriver,
      login,
      driverLogin,
      logout,
      updateDriverAvailability
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};