import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import './Home.css';

const CUISINES = ['All', 'American', 'Italian', 'Japanese', 'Indian', 'Mexican'];

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('All');

  useEffect(() => {
    fetchRestaurants();
  }, [search, activeCuisine]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (activeCuisine !== 'All') params.cuisine = activeCuisine;
      const { data } = await axios.get('/api/restaurants', { params });
      setRestaurants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Hungry? We've got <span className="hero-accent">you covered.</span>
          </h1>
          <p className="hero-subtitle">Order from the best restaurants in your area</p>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search restaurants"
            />
            {search && (
              <button className="clear-btn" onClick={() => setSearch('')} aria-label="Clear search">
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="container">
        {/* Cuisine filter */}
        <div className="cuisine-filter">
          {CUISINES.map((c) => (
            <button
              key={c}
              className={`cuisine-btn ${activeCuisine === c ? 'active' : ''}`}
              onClick={() => setActiveCuisine(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Restaurant grid */}
        <section className="restaurants-section">
          <h2 className="section-title">
            {activeCuisine !== 'All' ? `${activeCuisine} Restaurants` : 'All Restaurants'}
            {search && ` — "${search}"`}
          </h2>

          {loading ? (
            <div className="grid-skeleton">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="skeleton-card" />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="empty-state">
              <p>🍽️</p>
              <p>No restaurants found. Try a different search.</p>
            </div>
          ) : (
            <div className="restaurant-grid">
              {restaurants.map((r) => (
                <RestaurantCard key={r._id} restaurant={r} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
