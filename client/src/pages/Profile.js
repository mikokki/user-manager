import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateProfile } from '../services/authService';
import { useError } from '../context/ErrorContext';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showError } = useError();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      const userData = response.data;
      setUser(userData);
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        zipCode: userData.zipCode || '',
      });
    } catch (err) {
      showError(err.message || 'Failed to fetch profile', 'Error Loading Profile');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateProfile(formData);
      setSuccess(true);
      // Refresh user data
      await fetchProfile();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      showError(err.message || 'Failed to update profile', 'Error Updating Profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="error-message">
        <p>Unable to load profile</p>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="detail-header">
        <h2>
          My Profile
          {user.role === 'admin' && <span className="role-badge admin">Admin</span>}
        </h2>
        <span className={`status-badge ${user.status}`}>{user.status}</span>
      </div>

      {success && (
        <div className="alert alert-success">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="zipCode">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              disabled={saving}
            />
          </div>
        </div>

        <div className="detail-section">
          <h3>Account Information</h3>
          <div className="detail-row">
            <span className="detail-label">Role:</span>
            <span className="detail-value">
              <span className={`role-text ${user.role}`}>{user.role}</span>
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Join Date:</span>
            <span className="detail-value">
              {new Date(user.joinDate).toLocaleDateString()}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Last Updated:</span>
            <span className="detail-value">
              {new Date(user.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
