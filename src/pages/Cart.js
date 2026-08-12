import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const DELIVERY_FEE = 40; // ₹40

const Cart = () => {
  const { cartItems, restaurantName, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = subtotal + DELIVERY_FEE;

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-page">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some delicious food to get started</p>
        <Link to="/" className="btn-primary">Browse Restaurants</Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="cart-page container">
      <h1 className="cart-title">Your Cart</h1>
      <p className="cart-restaurant">From: <strong>{restaurantName}</strong></p>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p className="cart-item-price">₹{item.price.toFixed(0)} each</p>
              </div>
              <div className="cart-item-controls">
                <div className="qty-row">
                  <button
                    className="qty-btn-dark"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    aria-label="Decrease"
                  >−</button>
                  <span className="qty-num">{item.quantity}</span>
                  <button
                    className="qty-btn-dark"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    aria-label="Increase"
                  >+</button>
                </div>
                <span className="cart-item-total">₹{(item.price * item.quantity).toFixed(0)}</span>
                <button className="remove-btn" onClick={() => removeFromCart(item._id)} aria-label="Remove item">🗑</button>
              </div>
            </div>
          ))}

          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal ({totalItems} items)</span>
            <span>₹{subtotal.toFixed(0)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{DELIVERY_FEE}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
          <button className="btn-primary checkout-btn" onClick={handleCheckout}>
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
          <Link to="/" className="continue-link">+ Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
