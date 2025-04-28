import React, { useEffect } from "react";
import { createOrder } from "../api/order";

const OrderSuccess: React.FC = () => {
  useEffect(() => {
    const callApi = async () => {
      try {
        const orderDataString = localStorage.getItem("pendingOrder");

        if (!orderDataString) {
          console.error("No pending order found in local storage.");
          return;
        }

        const orderData = JSON.parse(orderDataString);

        const newOrderData = {
          ...orderData,
          paymentStatus: "PAID",
        };

        const response = await createOrder(newOrderData);
        console.log("API Response:", response);

        // If successful, clear the pendingOrder from localStorage
        localStorage.removeItem("pendingOrder");
        console.log("Pending order removed from localStorage.");
      } catch (error) {
        console.error("Error calling API:", error);
      }
    };

    callApi();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Order Successful!</h1>
      <p>
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <button onClick={() => (window.location.href = "/")}>Go to Home</button>
    </div>
  );
};

export default OrderSuccess;
