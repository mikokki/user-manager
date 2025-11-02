import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, deleteUser } from '../services/userService';
import { useError } from '../context/ErrorContext';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUserById(id);
      setUser(data.data);
    } catch (err) {
      showError(err.message || 'Failed to fetch user details', 'Error Loading User Details');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleEdit = () => {
    navigate(`/users/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      try {
        await deleteUser(id);
        navigate('/users');
      } catch (err) {
        showError(err.message || 'Failed to delete user', 'Error Deleting User');
      }
    }
  };

  const handleBack = () => {
    navigate('/users');
  };

  if (loading) {
    return <div className="loading">Loading user details...</div>;
  }

  if (!user) {
    return (
      <div className="error-message">
        <p>User not found</p>
        <button onClick={handleBack} className="btn btn-secondary">
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="user-detail-container">
      <div className="detail-header">
        <h2>
          User Details
          {user.role === 'admin' && <span className="role-badge admin">Admin</span>}
        </h2>
        <span className={`status-badge ${user.status}`}>{user.status}</span>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <h3>Personal Information</h3>
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">
              {user.firstName} {user.lastName}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Role:</span>
            <span className="detail-value">
              <span className={`role-text ${user.role}`}>{user.role}</span>
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{user.phone || 'N/A'}</span>
          </div>
        </div>

        <div className="detail-section">
          <h3>Address Information</h3>
          <div className="detail-row">
            <span className="detail-label">Address:</span>
            <span className="detail-value">{user.address || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">City:</span>
            <span className="detail-value">{user.city || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">State:</span>
            <span className="detail-value">{user.state || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Zip Code:</span>
            <span className="detail-value">{user.zipCode || 'N/A'}</span>
          </div>
        </div>

        <div className="detail-section">
          <h3>Account Information</h3>
          <div className="detail-row">
            <span className="detail-label">Join Date:</span>
            <span className="detail-value">
              {new Date(user.joinDate).toLocaleDateString()}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Created At:</span>
            <span className="detail-value">
              {new Date(user.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Last Updated:</span>
            <span className="detail-value">
              {new Date(user.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-actions">
        <button onClick={handleBack} className="btn btn-secondary">
          Back to List
        </button>
        <button onClick={handleEdit} className="btn btn-warning">
          Edit User
        </button>
        <button onClick={handleDelete} className="btn btn-danger">
          Delete User
        </button>
      </div>
    </div>
  );
};

export default UserDetail;
