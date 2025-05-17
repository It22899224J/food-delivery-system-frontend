import api from './axios';

export const processCardPayment = async (paymentData: any): Promise<any> => {
  try {
    const response = await api.post(
      `http://localhost:8089/payments/create-checkout`,
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("Payment processing error:", error);
    throw error;
  }
};
