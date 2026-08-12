import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, restaurantsRes] = await Promise.all([
          axios.get('/api/orders'),
          axios.get('/api/restaurants'),
        ]);

        const orders = ordersRes.data;
        const restaurants = restaurantsRes.data;

        const totalRevenue = orders
          .filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.totalAmount, 0);

        const statusCounts = orders.reduce((acc, o) => {
          acc[o.status] = (acc[o.status] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalRestaurants: restaurants.length,
          pending: statusCounts.pending || 0,
          preparing: (statusCounts.confirmed || 0) + (statusCounts.preparing || 0),
          delivered: statusCounts.delivered || 0,
          cancelled: statusCounts.cancelled || 0,
        });

        setRecentOrders(orders.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <span className="dashboard-date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">📦</div>
          <div>
            <p className="stat-label">Total Orders</p>
            <p className="stat-value">{stats?.totalOrders}</p>
          </div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon">💰</div>
          <div>
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{stats?.totalRevenue?.toFixed(0)}</p>
          </div>
        </div>
        <div className="stat-card stat-orange">
          <div className="stat-icon">🏪</div>
          <div>
            <p className="stat-label">Restaurants</p>
            <p className="stat-value">{stats?.totalRestaurants}</p>
          </div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon">🕐</div>
          <div>
            <p className="stat-label">Pending Orders</p>
            <p className="stat-value">{stats?.pending}</p>
          </div>
        </div>
      </div>

      {/* Order status breakdown */}
      <div className="dashboard-grid">
        <div className="admin-card">
          <div className="card-header">
            <h2>Order Status</h2>
          </div>
          <div className="status-breakdown">
            {[
              { label: 'Pending', count: stats?.pending, cls: 'status-pending' },
              { label: 'In Kitchen', count: stats?.preparing, cls: 'status-preparing' },
              { label: 'Delivered', count: stats?.delivered, cls: 'status-delivered' },
              { label: 'Cancelled', count: stats?.cancelled, cls: 'status-cancelled' },
            ].map((s) => (
              <div key={s.label} className="status-row">
                <span className={`status-badge ${s.cls}`}>{s.label}</span>
                <div className="status-bar-wrap">
                  <div
                    className="status-bar"
                    style={{ width: stats?.totalOrders ? `${(s.count / stats?.totalOrders) * 100}%` : '0%' }}
                  />
                </div>
                <span className="status-count">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="admin-card">
          <div className="card-header"><h2>Quick Actions</h2></div>
          <div className="quick-actions">
            <Link to="/admin/restaurants" className="quick-action-btn">
              <span>🏪</span> Manage Restaurants
            </Link>
            <Link to="/admin/menu" className="quick-action-btn">
              <span>🍽️</span> Manage Menu Items
            </Link>
            <Link to="/admin/orders" className="quick-action-btn">
              <span>📦</span> Process Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="admin-card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h2>Recent Orders</h2>
          <Link to="/admin/orders" className="card-link">View all →</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: 30 }}>No orders yet</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td><code>#{order._id.slice(-6).toUpperCase()}</code></td>
                    <td>{order.user?.name || '—'}</td>
                    <td>{order.restaurant?.name || '—'}</td>
                    <td>₹{order.totalAmount.toFixed(0)}</td>
                    <td><span className={`status-badge status-${order.status}`}>{order.status.replace(/_/g, ' ')}</span></td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
