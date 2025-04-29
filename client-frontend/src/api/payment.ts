import axios from "axios";

export const processCardPayment = async (paymentData: any): Promise<any> => {
  try {
    const response = await axios.post(
      `http://localhost:3006/create-checkout`,
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("Payment processing error:", error);
    throw error;
  }
};
