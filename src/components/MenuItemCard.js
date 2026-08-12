import React from 'react';
import { useCart } from '../context/CartContext';
import './MenuItemCard.css';

/**
 * MenuItemCard
 * - Clicking the card (image / name / desc) → opens ItemPopup  (handled by parent via onCardClick)
 * - Clicking ADD / qty buttons → cart actions (no popup)
 */
const MenuItemCard = ({ item, restaurantId, restaurantName, onCardClick }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const cartItem = cartItems.find((i) => i._id === item._id);

  const handleCardClick = () => {
    if (onCardClick) onCardClick(item);
  };

  return (
    <div className="menu-item-card">
      {/* Clickable top area → popup */}
      <div className="menu-item-clickable" onClick={handleCardClick} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
        aria-label={`View details for ${item.name}`}>

        {/* Image */}
        <div className="menu-item-img-wrap">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="menu-item-img"
              onError={(e) => {
                e.target.parentElement.classList.add('img-fallback');
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="img-fallback-box">🍽️</div>
          )}
          <span className={`veg-dot ${item.isVeg ? 'veg' : 'nonveg'}`} title={item.isVeg ? 'Veg' : 'Non-veg'} />
        </div>

        {/* Text */}
        <div className="menu-item-body">
          <h4 className="menu-item-name">{item.name}</h4>
          {item.description && (
            <p className="menu-item-desc">{item.description}</p>
          )}
        </div>
      </div>

      {/* Footer — price + cart controls (NOT inside clickable area) */}
      <div className="menu-item-footer">
        <span className="menu-item-price">₹{item.price.toFixed(0)}</span>

        {cartItem ? (
          <div className="qty-controls" role="group" aria-label="Quantity">
            <button
              className="qty-btn"
              onClick={(e) => { e.stopPropagation(); updateQuantity(item._id, cartItem.quantity - 1); }}
              aria-label="Decrease"
            >−</button>
            <span className="qty-count">{cartItem.quantity}</span>
            <button
              className="qty-btn"
              onClick={(e) => { e.stopPropagation(); updateQuantity(item._id, cartItem.quantity + 1); }}
              aria-label="Increase"
            >+</button>
          </div>
        ) : (
          <button
            className="add-btn"
            onClick={(e) => { e.stopPropagation(); addToCart(item, restaurantId, restaurantName); }}
            aria-label={`Add ${item.name}`}
          >
            + ADD
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
