import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant._id}`} className="restaurant-card">
      <div className="restaurant-image-wrapper">
        <img
          src={restaurant.image || 'https://via.placeholder.com/400x200?text=Restaurant'}
          alt={restaurant.name}
          className="restaurant-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200?text=Restaurant';
          }}
        />
        {!restaurant.isOpen && (
          <div className="closed-overlay">Closed</div>
        )}
      </div>
      <div className="restaurant-info">
        <h3 className="restaurant-name">{restaurant.name}</h3>
        <p className="restaurant-cuisine">{restaurant.cuisine}</p>
        <div className="restaurant-meta">
          <span className="rating">⭐ {restaurant.rating}</span>
          <span className="dot">·</span>
          <span>{restaurant.deliveryTime}</span>
          <span className="dot">·</span>
          <span>${restaurant.deliveryFee} delivery</span>
        </div>
        {restaurant.tags && restaurant.tags.length > 0 && (
          <div className="restaurant-tags">
            {restaurant.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default RestaurantCard;
