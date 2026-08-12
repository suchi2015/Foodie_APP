import React from 'react';
import { useCart } from '../context/CartContext';
import './ItemPopup.css';

const ItemPopup = ({ item, restaurantId, restaurantName, onClose }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const cartItem = cartItems.find((i) => i._id === item._id);

  // close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="ip-overlay" onClick={handleBackdrop} role="dialog" aria-modal="true" aria-label={item.name}>
      <div className="ip-sheet">
        {/* Close btn */}
        <button className="ip-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Image */}
        {item.image ? (
          <div className="ip-img-wrap">
            <img
              src={item.image}
              alt={item.name}
              className="ip-img"
              onError={(e) => { e.target.parentElement.style.display = 'none'; }}
            />
          </div>
        ) : (
          <div className="ip-img-placeholder">🍽️</div>
        )}

        {/* Body */}
        <div className="ip-body">
          {/* Veg badge */}
          <span className={`ip-veg-badge ${item.isVeg ? 'veg' : 'nonveg'}`}>
            <span className="ip-veg-dot" />
            {item.isVeg ? 'Veg' : 'Non-veg'}
          </span>

          <h2 className="ip-name">{item.name}</h2>
          {item.description && <p className="ip-desc">{item.description}</p>}

          {/* Rating pill (if present) */}
          {item.rating && (
            <div className="ip-rating">⭐ {item.rating} rating</div>
          )}

          {/* Price + CTA */}
          <div className="ip-footer">
            <div className="ip-price">
              <span className="ip-price-label">Price</span>
              <span className="ip-price-value">₹{item.price.toFixed(0)}</span>
            </div>

            {cartItem ? (
              <div className="ip-qty-controls">
                <button
                  className="ip-qty-btn"
                  onClick={() => updateQuantity(item._id, cartItem.quantity - 1)}
                  aria-label="Decrease"
                >−</button>
                <span className="ip-qty-count">{cartItem.quantity}</span>
                <button
                  className="ip-qty-btn"
                  onClick={() => updateQuantity(item._id, cartItem.quantity + 1)}
                  aria-label="Increase"
                >+</button>
              </div>
            ) : (
              <button
                className="ip-add-btn"
                onClick={() => {
                  addToCart(item, restaurantId, restaurantName);
                }}
              >
                + Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPopup;
