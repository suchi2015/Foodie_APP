import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartDrawer.css';

const DELIVERY_FEE = 40;

const CartDrawer = ({ open, onClose }) => {
  const { cartItems, restaurantName, subtotal, totalItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = subtotal + DELIVERY_FEE;

  const handleCheckout = () => {
    onClose();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      {/* Backdrop */}
      {open && <div className="cd-backdrop" onClick={onClose} />}

      {/* Drawer */}
      <div className={`cd-drawer ${open ? 'cd-open' : ''}`} aria-label="Cart" role="complementary">
        {/* Header */}
        <div className="cd-header">
          <div className="cd-header-left">
            <span className="cd-cart-icon">🛒</span>
            <div>
              <p className="cd-title">Your Cart</p>
              {restaurantName && <p className="cd-restaurant">{restaurantName}</p>}
            </div>
          </div>
          <button className="cd-close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {/* Body */}
        <div className="cd-body">
          {cartItems.length === 0 ? (
            <div className="cd-empty">
              <span className="cd-empty-icon">🛒</span>
              <p>Your cart is empty</p>
              <span>Add items to get started</span>
            </div>
          ) : (
            <ul className="cd-items">
              {cartItems.map((item) => (
                <li key={item._id} className="cd-item">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cd-item-img"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="cd-item-info">
                    <p className="cd-item-name">{item.name}</p>
                    <p className="cd-item-price">₹{item.price.toFixed(0)}</p>
                  </div>
                  <div className="cd-item-controls">
                    <button
                      className="cd-qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      aria-label="Decrease"
                    >−</button>
                    <span className="cd-qty">{item.quantity}</span>
                    <button
                      className="cd-qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      aria-label="Increase"
                    >+</button>
                  </div>
                  <span className="cd-item-total">₹{(item.price * item.quantity).toFixed(0)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only when cart has items */}
        {cartItems.length > 0 && (
          <div className="cd-footer">
            <div className="cd-bill">
              <div className="cd-bill-row">
                <span>Item Total</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="cd-bill-row">
                <span>Delivery Fee</span>
                <span>₹{DELIVERY_FEE}</span>
              </div>
              <div className="cd-bill-divider" />
              <div className="cd-bill-row cd-bill-total">
                <span>To Pay</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
            </div>

            <button className="cd-checkout-btn" onClick={handleCheckout}>
              <span>{totalItems} item{totalItems > 1 ? 's' : ''} · ₹{total.toFixed(0)}</span>
              <span>Place Order →</span>
            </button>

            <button className="cd-clear-btn" onClick={clearCart}>Clear cart</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
