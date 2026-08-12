import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './OrderDetail.css';

const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="loading-page">Loading order...</div>;
  if (!order) return <div className="loading-page">Order not found.</div>;

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="order-detail-page container">
      <Link to="/orders" className="back-link">← Back to Orders</Link>

      <div className="order-detail-header">
        <div>
          <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="order-detail-date">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className={`status-pill status-${order.status}`}>
          {order.status.replace(/_/g, ' ')}
        </div>
      </div>

      {/* Progress tracker */}
      {order.status !== 'cancelled' && (
        <div className="progress-tracker">
          {STATUS_STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <div className={`progress-step ${i <= stepIndex ? 'done' : ''}`}>
                <div className="step-circle">
                  {i <= stepIndex ? '✓' : i + 1}
                </div>
                <span className="step-label">{step.replace(/_/g, ' ')}</span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`progress-line ${i < stepIndex ? 'done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="order-detail-layout">
        {/* Items */}
        <div className="order-items-section">
          <h3>Items from {order.restaurant?.name}</h3>
          <div className="order-items-table">
            {order.items.map((item, i) => (
              <div key={i} className="order-item-row">
                <span className="item-name">{item.name}</span>
                <span className="item-qty">× {item.quantity}</span>
                <span className="item-price">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>₹{(order.totalAmount - order.deliveryFee).toFixed(0)}</span>
            </div>
            <div className="total-row">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee.toFixed(0)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>₹{order.totalAmount.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="delivery-info-section">
          <h3>Delivery Details</h3>
          <div className="info-card">
            <p className="info-label">Address</p>
            <p>{order.deliveryAddress.street}</p>
            <p>{order.deliveryAddress.city}{order.deliveryAddress.state ? `, ${order.deliveryAddress.state}` : ''} {order.deliveryAddress.zip}</p>
          </div>
          <div className="info-card">
            <p className="info-label">Payment</p>
            <p>{order.paymentMethod === 'cash' ? '💵 Cash on Delivery' : '💳 Card'}</p>
          </div>
          <div className="info-card">
            <p className="info-label">Estimated Delivery</p>
            <p>{order.estimatedDelivery}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
