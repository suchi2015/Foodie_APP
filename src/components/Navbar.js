import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAdmin ? '/admin' : '/'} className="navbar-brand">
          🍔 FoodieApp
          {isAdmin && <span className="admin-pill">Admin</span>}
        </Link>

        <div className="navbar-links">
          {!isAdmin && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/cart" className="nav-link cart-link">
                <span>Cart</span>
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className="nav-link">Admin Panel</Link>
          )}

          {user ? (
            <div className="nav-dropdown">
              <button className="nav-user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                {user.name.split(' ')[0]} ▾
              </button>
              {menuOpen && (
                <div className="dropdown-menu">
                  {isAdmin ? (
                    <>
                      <Link to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                      <Link to="/admin/restaurants" onClick={() => setMenuOpen(false)}>Restaurants</Link>
                      <Link to="/admin/menu" onClick={() => setMenuOpen(false)}>Menu Items</Link>
                      <Link to="/admin/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
                      <div className="dropdown-divider" />
                      <Link to="/" onClick={() => setMenuOpen(false)}>View Site</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                      <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                    </>
                  )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
