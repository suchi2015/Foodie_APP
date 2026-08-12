import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import MenuItemCard from '../components/MenuItemCard';
import ItemPopup from '../components/ItemPopup';
import CartDrawer from '../components/CartDrawer';
import './RestaurantDetail.css';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Popup & drawer state
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const { totalItems, subtotal } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes, mRes] = await Promise.all([
          axios.get(`/api/restaurants/${id}`),
          axios.get(`/api/menu/${id}`),
        ]);
        setRestaurant(rRes.data);
        setMenuItems(mRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Close popup on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
        setCartOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (loading) return <div className="loading-page">Loading...</div>;
  if (!restaurant) return <div className="loading-page">Restaurant not found.</div>;

  const categories = ['All', ...new Set(menuItems.map((i) => i.category))];
  const filtered = activeCategory === 'All'
    ? menuItems
    : menuItems.filter((i) => i.category === activeCategory);

  return (
    <div className="restaurant-detail">
      {/* ── Banner ─────────────────────────────── */}
      <div className="restaurant-banner">
        <img
          src={restaurant.image || 'https://via.placeholder.com/1200x300'}
          alt={restaurant.name}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x300'; }}
        />
        <div className="banner-overlay" />
        <div className="banner-info">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <div className="banner-meta">
            <span>⭐ {restaurant.rating}</span>
            <span>🕐 {restaurant.deliveryTime}</span>
            <span>🛵 ₹{restaurant.deliveryFee} delivery</span>
            <span>📦 Min. ₹{restaurant.minOrder}</span>
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────── */}
      <div className="rd-content container">
        {/* Category tabs */}
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        {filtered.length === 0 ? (
          <p className="no-items">No items in this category.</p>
        ) : (
          <div className="menu-grid">
            {filtered.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                restaurantId={restaurant._id}
                restaurantName={restaurant.name}
                onCardClick={setSelectedItem}
              />
            ))}
          </div>
        )}

        {/* bottom breathing room */}
        <div style={{ height: 100 }} />
      </div>

      {/* ── Floating Cart Bar (Zepto style) ──────── */}
      {totalItems > 0 && (
        <div className="floating-cart-bar" onClick={() => setCartOpen(true)} role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setCartOpen(true)}
          aria-label={`View cart — ${totalItems} items`}>
          <div className="fcb-left">
            <span className="fcb-count">{totalItems}</span>
            <span className="fcb-label">item{totalItems > 1 ? 's' : ''} added</span>
          </div>
          <span className="fcb-center">View Cart</span>
          <span className="fcb-right">₹{subtotal.toFixed(0)} →</span>
        </div>
      )}

      {/* ── Item Detail Popup ─────────────────────── */}
      {selectedItem && (
        <ItemPopup
          item={selectedItem}
          restaurantId={restaurant._id}
          restaurantName={restaurant.name}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* ── Cart Drawer ───────────────────────────── */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default RestaurantDetail;
