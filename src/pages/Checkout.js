import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const DELIVERY_FEE = 40; // ₹40

const Checkout = () => {
  const { cartItems, restaurantId, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    paymentMethod: 'cash',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.street || !form.city) {
      toast.error('Please fill delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderItems = cartItems.map((item) => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const { data } = await api.post('/api/orders', {
        restaurant: restaurantId,
        items: orderItems,
        totalAmount: subtotal + DELIVERY_FEE,
        deliveryFee: DELIVERY_FEE,
        deliveryAddress: { street: form.street, city: form.city, state: form.state, zip: form.zip },
        paymentMethod: form.paymentMethod,
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const total = subtotal + DELIVERY_FEE;

  return (
    <div className="checkout-page container">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Delivery Address</h3>
            <div className="form-group">
              <label htmlFor="street">Street Address *</label>
              <input id="street" name="street" value={form.street} onChange={handleChange} placeholder="H.No 1-2-3, Main Road" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input id="city" name="city" value={form.city} onChange={handleChange} placeholder="Hyderabad" required />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input id="state" name="state" value={form.state} onChange={handleChange} placeholder="Telangana" />
              </div>
              <div className="form-group">
                <label htmlFor="zip">PIN Code</label>
                <input id="zip" name="zip" value={form.zip} onChange={handleChange} placeholder="500001" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label className={`payment-option ${form.paymentMethod === 'cash' ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value="cash" checked={form.paymentMethod === 'cash'} onChange={handleChange} />
                💵 Cash on Delivery
              </label>
              <label className={`payment-option ${form.paymentMethod === 'card' ? 'selected' : ''}`}>
                <input type="radio" name="paymentMethod" value="card" checked={form.paymentMethod === 'card'} onChange={handleChange} />
                💳 Pay by Card
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary place-order-btn" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order — ₹${total.toFixed(0)}`}
          </button>
        </form>

        {/* Order summary */}
        <div className="order-summary-box">
          <h3>Order Summary</h3>
          <ul className="order-items-list">
            {cartItems.map((item) => (
              <li key={item._id}>
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(0)}</span>
              </li>
            ))}
          </ul>
          <div className="summary-divider" />
          <div className="summary-line">
            <span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span>
          </div>
          <div className="summary-line">
            <span>Delivery</span><span>₹{DELIVERY_FEE}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-line total-line">
            <span>Total</span><span>₹{total.toFixed(0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
