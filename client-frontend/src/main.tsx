import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import MenuItemsProvider from "./context/MenuItemsContext.tsx";

createRoot(document.getElementById("root")!).render(
    <Router>
      <AuthProvider>
        <CartProvider>
        <MenuItemsProvider>
          <App />
          </MenuItemsProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
);
