import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminOrders.css';

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders');
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const { data } = await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order marked as "${STATUS_LABELS[newStatus]}"`);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    await updateStatus(orderId, 'cancelled');
  };

  const getNextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx !== -1 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  const filtered = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Orders</h1>
        <button className="action-btn btn-view" onClick={fetchOrders}>↻ Refresh</button>
      </div>

      {/* Status filter tabs */}
      <div className="order-filter-tabs">
        {[{ key: 'all', label: 'All', count: orders.length },
          { key: 'pending', label: 'Pending', count: counts.pending || 0 },
          { key: 'confirmed', label: 'Confirmed', count: counts.confirmed || 0 },
          { key: 'preparing', label: 'Preparing', count: counts.preparing || 0 },
          { key: 'out_for_delivery', label: 'Out for Delivery', count: counts.out_for_delivery || 0 },
          { key: 'delivered', label: 'Delivered', count: counts.delivered || 0 },
          { key: 'cancelled', label: 'Cancelled', count: counts.cancelled || 0 },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`filter-tab ${filterStatus === tab.key ? 'active' : ''}`}
            onClick={() => setFilterStatus(tab.key)}
          >
            {tab.label}
            {tab.count > 0 && <span className="filter-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className="orders-panel">
        {/* Orders list */}
        <div className={`orders-list-panel ${selectedOrder ? 'panel-split' : ''}`}>
          <div className="admin-card">
            {loading ? (
              <div className="admin-loading">Loading orders...</div>
            ) : filtered.length === 0 ? (
              <div className="admin-empty"><p>📦</p><p>No orders found</p></div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Restaurant</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((order) => {
                      const next = getNextStatus(order.status);
                      return (
                        <tr
                          key={order._id}
                          className={selectedOrder?._id === order._id ? 'row-selected' : ''}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td><code style={{ fontSize: '0.8rem' }}>#{order._id.slice(-6).toUpperCase()}</code></td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{order.user?.name || '—'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#718096' }}>{order.user?.email}</div>
                          </td>
                          <td>{order.restaurant?.name || '—'}</td>
                          <td>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                          <td><strong>₹{order.totalAmount.toFixed(0)}</strong></td>
                          <td>
                            <span className={`status-badge status-${order.status}`}>
                              {STATUS_LABELS[order.status]}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.82rem', color: '#718096' }}>
                            {new Date(order.createdAt).toLocaleDateString()}<br />
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              {next && (
                                <button
                                  className="action-btn btn-view"
                                  style={{ whiteSpace: 'nowrap' }}
                                  onClick={() => updateStatus(order._id, next)}
                                  disabled={updating}
                                >
                                  → {STATUS_LABELS[next]}
                                </button>
                              )}
                              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                <button
                                  className="action-btn btn-delete"
                                  onClick={() => cancelOrder(order._id)}
                                  disabled={updating}
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Order detail side panel */}
        {selectedOrder && (
          <div className="order-detail-panel">
            <div className="admin-card">
              <div className="card-header">
                <h2>Order #{selectedOrder._id.slice(-6).toUpperCase()}</h2>
                <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
              </div>

              <div className="order-detail-body">
                {/* Status stepper */}
                <div className="detail-section">
                  <p className="detail-label">Status</p>
                  <div className="status-stepper">
                    {STATUS_FLOW.map((s, i) => {
                      const currentIdx = STATUS_FLOW.indexOf(selectedOrder.status);
                      const isCancelled = selectedOrder.status === 'cancelled';
                      const isDone = !isCancelled && i <= currentIdx;
                      const isCurrent = !isCancelled && i === currentIdx;
                      return (
                        <div key={s} className={`stepper-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                          <div className="stepper-dot" />
                          <span>{STATUS_LABELS[s]}</span>
                        </div>
                      );
                    })}
                    {selectedOrder.status === 'cancelled' && (
                      <div className="stepper-step cancelled">
                        <div className="stepper-dot" />
                        <span>Cancelled</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick status update */}
                <div className="detail-section">
                  <p className="detail-label">Update Status</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {STATUS_FLOW.filter((s) => s !== selectedOrder.status).map((s) => (
                      <button
                        key={s}
                        className={`action-btn ${s === 'delivered' ? 'btn-view' : 'btn-edit'}`}
                        onClick={() => updateStatus(selectedOrder._id, s)}
                        disabled={updating}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                    {selectedOrder.status !== 'cancelled' && (
                      <button className="action-btn btn-delete" onClick={() => cancelOrder(selectedOrder._id)} disabled={updating}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Customer */}
                <div className="detail-section">
                  <p className="detail-label">Customer</p>
                  <p style={{ fontWeight: 600 }}>{selectedOrder.user?.name}</p>
                  <p style={{ fontSize: '0.83rem', color: '#718096' }}>{selectedOrder.user?.email}</p>
                </div>

                {/* Delivery address */}
                <div className="detail-section">
                  <p className="detail-label">Delivery Address</p>
                  <p>{selectedOrder.deliveryAddress?.street}</p>
                  <p>{selectedOrder.deliveryAddress?.city}{selectedOrder.deliveryAddress?.state ? `, ${selectedOrder.deliveryAddress.state}` : ''}</p>
                </div>

                {/* Payment */}
                <div className="detail-section">
                  <p className="detail-label">Payment</p>
                  <p>{selectedOrder.paymentMethod === 'cash' ? '💵 Cash on Delivery' : '💳 Card'}</p>
                </div>

                {/* Items */}
                <div className="detail-section">
                  <p className="detail-label">Items</p>
                  <div className="detail-items">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="detail-item-row">
                        <span>{item.name} × {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="detail-item-row" style={{ borderTop: '1px solid #eee', paddingTop: 8, fontWeight: 700 }}>
                      <span>Total</span>
                      <span>₹{selectedOrder.totalAmount.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: 8 }}>
                  Placed {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
