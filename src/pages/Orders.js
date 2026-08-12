import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Orders.css';

const STATUS_COLORS = {
  pending: '#f6ad55',
  confirmed: '#63b3ed',
  preparing: '#76e4f7',
  out_for_delivery: '#9f7aea',
  delivered: '#68d391',
  cancelled: '#fc8181',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="loading-page">Loading orders...</div>;

  return (
    <div className="orders-page container">
      <h1 className="orders-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>📦</p>
          <p>No orders yet</p>
          <Link to="/" className="btn-primary">Order Food</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link to={`/orders/${order._id}`} key={order._id} className="order-card">
              <div className="order-card-left">
                {order.restaurant?.image && (
                  <img src={order.restaurant.image} alt={order.restaurant.name} className="order-restaurant-img" />
                )}
                <div>
                  <h4>{order.restaurant?.name || 'Restaurant'}</h4>
                  <p className="order-items-summary">
                    {order.items.slice(0, 2).map((i) => i.name).join(', ')}
                    {order.items.length > 2 && ` +${order.items.length - 2} more`}
                  </p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="order-card-right">
                <span
                  className="order-status-badge"
                  style={{ background: STATUS_COLORS[order.status] + '30', color: STATUS_COLORS[order.status] }}
                >
                  {order.status.replace(/_/g, ' ')}
                </span>
                <p className="order-amount">₹{order.totalAmount.toFixed(0)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
