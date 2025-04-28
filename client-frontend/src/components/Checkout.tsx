import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../api';

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.addresses?.[0] || '');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated or cart is empty
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (items.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, items, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      setError('Please enter a delivery address');
      return;
    }
    
    if (paymentMethod === 'credit_card') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
        setError('Please fill in all payment details');
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Get restaurant info from first item (assuming all items are from same restaurant)
      const restaurantId = items[0]?.restaurantId;
      const restaurantName = items[0]?.name.split(' ')[0]; // Simple way to get restaurant name
      
      const order = await placeOrder({
        items,
        restaurantId,
        restaurantName,
        total: totalPrice + 3.99 + (totalPrice * 0.08),
        deliveryAddress: address,
      });
      
      // Clear cart and redirect to tracking page
      clearCart();
      navigate(`/tracking/${order.id}`);
      
    } catch (err) {
      console.error('Failed to place order:', err);
      setError('Failed to place your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format card expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return value;
  };

  return (
    <div>
      <button 
        onClick={() => navigate('/cart')}
        className="flex items-center text-gray-600 hover:text-orange-500 mb-6"
      >
        <ArrowLeft size={20} className="mr-1" />
        Back to Cart
      </button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin size={20} className="mr-2 text-orange-500" />
                Delivery Address
              </h2>
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  placeholder="Enter your full delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard size={20} className="mr-2 text-orange-500" />
                Payment Method
              </h2>
              
              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="credit_card"
                    name="payment_method"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={() => setPaymentMethod('credit_card')}
                    className="mr-2"
                  />
                  <label htmlFor="credit_card" className="flex items-center">
                    <CreditCard size={20} className="mr-2" />
                    Credit Card
                  </label>
                </div>
                
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="cash"
                    name="payment_method"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="mr-2"
                  />
                  <label htmlFor="cash">Cash on Delivery</label>
                </div>
              </div>

              {paymentMethod === 'credit_card' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="card_number" className="block text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="card_number"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="card_name" className="block text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="card_name"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="card_expiry" className="block text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="card_expiry"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="card_cvc" className="block text-gray-700 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        id="card_cvc"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="max-h-64 overflow-y-auto mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{item.quantity}x</span>
                    <span>{item.name}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-4 pt-3 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>$3.99</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${(totalPrice + 3.99 + totalPrice * 0.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;