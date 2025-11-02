import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, updateUser, getUserById } from '../services/userService';
import { useError } from '../context/ErrorContext';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    status: 'active',
    role: 'user',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showError } = useError();

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUserById(id);
      setFormData({
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        email: data.data.email,
        phone: data.data.phone || '',
        address: data.data.address || '',
        city: data.data.city || '',
        state: data.data.state || '',
        zipCode: data.data.zipCode || '',
        status: data.data.status,
        role: data.data.role || 'user',
      });
    } catch (err) {
      showError(err.message || 'Failed to fetch user', 'Error Loading User');
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    if (isEditMode) {
      fetchUser();
    }
  }, [isEditMode, fetchUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      if (isEditMode) {
        // Exclude password from update (passwords should be changed via separate endpoint)
        const { password, ...updateData } = formData;
        await updateUser(id, updateData);
      } else {
        await createUser(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (err) {
      showError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} user`, `Error ${isEditMode ? 'Updating' : 'Creating'} User`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  if (loading && isEditMode) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="form-container">
      <h2>{isEditMode ? 'Edit User' : 'Add New User'}</h2>

      {success && (
        <div className="alert alert-success">
          User {isEditMode ? 'updated' : 'created'} successfully! Redirecting...
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
              disabled={loading}
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
              disabled={loading}
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
            disabled={loading}
          />
        </div>

        {!isEditMode && (
          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              disabled={loading}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
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
            disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">
              Status <span className="required">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="role">
              Role <span className="required">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
