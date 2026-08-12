import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, zip: form.zip },
      };
      if (form.password) payload.password = form.password;

      const { data } = await axios.put('/api/auth/profile', payload);
      updateUser(data);
      toast.success('Profile updated!');
      setForm((p) => ({ ...p, password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page container">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-layout">
        <div className="profile-avatar-section">
          <div className="avatar-circle">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
          {user?.role === 'admin' && <span className="admin-badge">Admin</span>}
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-section">
            <h3>Personal Info</h3>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email (read-only)</label>
              <input value={user?.email} readOnly className="readonly-input" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="555-0100" />
            </div>
          </div>

          <div className="profile-section">
            <h3>Delivery Address</h3>
            <div className="form-group">
              <label htmlFor="street">Street</label>
              <input id="street" name="street" value={form.street} onChange={handleChange} placeholder="123 Main St" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input id="city" name="city" value={form.city} onChange={handleChange} placeholder="New York" />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input id="state" name="state" value={form.state} onChange={handleChange} placeholder="NY" />
              </div>
              <div className="form-group">
                <label htmlFor="zip">ZIP</label>
                <input id="zip" name="zip" value={form.zip} onChange={handleChange} placeholder="10001" />
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Change Password</h3>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
