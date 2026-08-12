import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';

const EMPTY_FORM = {
  restaurant: '', name: '', description: '', price: '',
  category: '', image: '', isVeg: false, isAvailable: true,
};

const AdminMenu = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Load restaurants on mount
  useEffect(() => {
    axios.get('/api/restaurants').then(({ data }) => {
      setRestaurants(data);
      if (data.length > 0) setSelectedRestaurant(data[0]._id);
    });
  }, []);

  // Load menu when restaurant changes
  useEffect(() => {
    if (!selectedRestaurant) return;
    fetchMenu(selectedRestaurant);
  }, [selectedRestaurant]);

  const fetchMenu = async (restaurantId) => {
    try {
      setLoading(true);
      // Fetch all items (including unavailable) for admin — use a param flag
      const { data } = await axios.get(`/api/menu/admin/${restaurantId}`);
      setMenuItems(data);
    } catch (err) {
      // Fallback to normal endpoint
      try {
        const { data } = await axios.get(`/api/menu/${restaurantId}`);
        setMenuItems(data);
      } catch (e) {
        toast.error('Failed to load menu');
      }
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, restaurant: selectedRestaurant });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditTarget(item);
    setForm({
      restaurant: item.restaurant,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
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
      const payload = { ...form, price: Number(form.price) };

      if (editTarget) {
        await axios.put(`/api/menu/${editTarget._id}`, payload);
        toast.success('Menu item updated');
      } else {
        await axios.post('/api/menu', payload);
        toast.success('Menu item added');
      }
      setShowModal(false);
      fetchMenu(selectedRestaurant);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`/api/menu/${id}`);
      toast.success('Item deleted');
      fetchMenu(selectedRestaurant);
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await axios.put(`/api/menu/${item._id}`, { isAvailable: !item.isAvailable });
      toast.success(`${item.name} ${!item.isAvailable ? 'enabled' : 'disabled'}`);
      fetchMenu(selectedRestaurant);
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const categories = [...new Set(menuItems.map((i) => i.category))];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Menu Items</h1>
        <button className="btn-primary" onClick={openAdd} disabled={!selectedRestaurant}>
          + Add Item
        </button>
      </div>

      {/* Restaurant selector */}
      <div className="admin-card" style={{ padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label style={{ fontWeight: 700, fontSize: '0.88rem', color: '#4a5568', whiteSpace: 'nowrap' }}>
          Restaurant:
        </label>
        <select
          className="restaurant-select"
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
        >
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>{r.name}</option>
          ))}
        </select>
        <span style={{ fontSize: '0.82rem', color: '#718096' }}>
          {menuItems.length} item{menuItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="admin-loading">Loading menu...</div>
      ) : menuItems.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty"><p>🍽️</p><p>No menu items yet. Click "+ Add Item" to start.</p></div>
        </div>
      ) : (
        categories.map((cat) => (
          <div key={cat} className="admin-card" style={{ marginBottom: 20 }}>
            <div className="card-header"><h2>{cat}</h2></div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.filter((i) => i.category === cat).map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {item.image && (
                            <img
                              src={item.image} alt={item.name}
                              style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                            <div style={{ fontSize: '0.78rem', color: '#718096' }}>{item.description?.slice(0, 55)}{item.description?.length > 55 ? '...' : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td><strong>${item.price.toFixed(2)}</strong></td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{item.isVeg ? '🟢 Veg' : '🔴 Non-veg'}</span>
                      </td>
                      <td>
                        <button
                          className={`action-btn ${item.isAvailable ? 'btn-view' : 'btn-delete'}`}
                          onClick={() => toggleAvailability(item)}
                        >
                          {item.isAvailable ? '✓ Available' : '✗ Unavailable'}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="action-btn btn-edit" onClick={() => openEdit(item)}>Edit</button>
                          <button className="action-btn btn-delete" onClick={() => handleDelete(item._id, item.name)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editTarget ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Restaurant *</label>
                  <select name="restaurant" value={form.restaurant} onChange={handleChange} required>
                    <option value="">Select restaurant</option>
                    {restaurants.map((r) => (
                      <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Item Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Margherita Pizza" required />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Pizza, Sides" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="What's in it?" />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Price ($) *</label>
                    <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <ImageUpload
                      label="Image"
                      value={form.image}
                      onChange={(url) => setForm((p) => ({ ...p, image: url }))}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                    <input type="checkbox" name="isVeg" checked={form.isVeg} onChange={handleChange} />
                    🟢 Vegetarian
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                    <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} />
                    ✓ Available
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Saving...' : 'Save Item'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
