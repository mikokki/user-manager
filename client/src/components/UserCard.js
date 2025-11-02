import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser } from '../services/authService';

const UserCard = ({ user, onDelete }) => {
  const navigate = useNavigate();
  const currentUser = getStoredUser();

  const handleEdit = () => {
    navigate(`/users/edit/${user._id}`);
  };

  const handleView = () => {
    navigate(`/users/${user._id}`);
  };

  const handleDelete = () => {
    // Check if trying to delete own account
    const isSelf = currentUser && currentUser._id === user._id;

    const confirmMessage = isSelf
      ? `WARNING: You are about to delete your own account!\n\nThis will log you out immediately and you will lose access to the system.\n\nAre you absolutely sure you want to delete your account (${user.firstName} ${user.lastName})?`
      : `Are you sure you want to delete ${user.firstName} ${user.lastName}?`;

    if (window.confirm(confirmMessage)) {
      onDelete(user._id);
    }
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <h3>
          {user.firstName} {user.lastName}
          {user.role === 'admin' && <span className="role-badge admin">Admin</span>}
        </h3>
        <span className={`status-badge ${user.status}`}>
          {user.status}
        </span>
      </div>

      <div className="user-card-body">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> <span className={`role-text ${user.role}`}>{user.role}</span></p>
        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
        <p><strong>City:</strong> {user.city || 'N/A'}</p>
        <p><strong>State:</strong> {user.state || 'N/A'}</p>
        <p><strong>Joined:</strong> {new Date(user.joinDate).toLocaleDateString()}</p>
      </div>

      <div className="user-card-actions">
        <button onClick={handleView} className="btn btn-info">View</button>
        <button onClick={handleEdit} className="btn btn-warning">Edit</button>
        <button onClick={handleDelete} className="btn btn-danger">Delete</button>
      </div>
    </div>
  );
};

export default UserCard;
