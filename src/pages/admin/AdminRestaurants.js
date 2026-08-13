import React, { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';

const EMPTY_FORM = {
  name: '', description: '', cuisine: '', image: '',
  deliveryTime: '30-45 min', deliveryFee: 2.99, minOrder: 10,
  rating: 4.0, isOpen: true, tags: '',
};

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add new
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchRestaurants(); }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/restaurants');
      setRestaurants(data);
    } catch (err) {
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditTarget(r);
    setForm({
      name: r.name, description: r.description, cuisine: r.cuisine,
      image: r.image, deliveryTime: r.deliveryTime, deliveryFee: r.deliveryFee,
      minOrder: r.minOrder, rating: r.rating, isOpen: r.isOpen,
      tags: (r.tags || []).join(', '),
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        deliveryFee: Number(form.deliveryFee),
        minOrder: Number(form.minOrder),
        rating: Number(form.rating),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (editTarget) {
        await api.put(`/api/restaurants/${editTarget._id}`, payload);
        toast.success('Restaurant updated');
      } else {
        await api.post('/api/restaurants', payload);
        toast.success('Restaurant added');
      }
      setShowModal(false);
      fetchRestaurants();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This will also remove all its menu items.`)) return;
    try {
      await api.delete(`/api/restaurants/${id}`);
      toast.success('Restaurant deleted');
      fetchRestaurants();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Restaurants</h1>
        <button className="btn-primary" onClick={openAdd}>+ Add Restaurant</button>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : restaurants.length === 0 ? (
          <div className="admin-empty"><p>🏪</p><p>No restaurants yet</p></div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cuisine</th>
                  <th>Rating</th>
                  <th>Delivery</th>
                  <th>Min Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {r.image && (
                          <img
                            src={r.image} alt={r.name}
                            style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <strong>{r.name}</strong>
                      </div>
                    </td>
                    <td>{r.cuisine}</td>
                    <td>⭐ {r.rating}</td>
                    <td>${r.deliveryFee} · {r.deliveryTime}</td>
                    <td>${r.minOrder}</td>
                    <td>
                      <span className={`status-badge ${r.isOpen ? 'status-delivered' : 'status-cancelled'}`}>
                        {r.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="action-btn btn-edit" onClick={() => openEdit(r)}>Edit</button>
                        <button className="action-btn btn-delete" onClick={() => handleDelete(r._id, r.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editTarget ? 'Edit Restaurant' : 'Add Restaurant'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Restaurant Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Burger Palace" required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description..." />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Cuisine *</label>
                    <input name="cuisine" value={form.cuisine} onChange={handleChange} placeholder="e.g. Italian" required />
                  </div>
                  <div className="form-group">
                    <label>Rating (0–5)</label>
                    <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <ImageUpload
                    label="Image"
                    value={form.image}
                    onChange={(url) => setForm((p) => ({ ...p, image: url }))}
                  />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Delivery Time</label>
                    <input name="deliveryTime" value={form.deliveryTime} onChange={handleChange} placeholder="30-45 min" />
                  </div>
                  <div className="form-group">
                    <label>Delivery Fee ($)</label>
                    <input name="deliveryFee" type="number" step="0.01" min="0" value={form.deliveryFee} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Min Order ($)</label>
                    <input name="minOrder" type="number" step="0.01" min="0" value={form.minOrder} onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 22 }}>
                      <input type="checkbox" name="isOpen" checked={form.isOpen} onChange={handleChange} />
                      Currently Open
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Tags (comma-separated)</label>
                  <input name="tags" value={form.tags} onChange={handleChange} placeholder="pizza, italian, fast food" />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRestaurants;
