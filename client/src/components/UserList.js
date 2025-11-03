import { useState, useEffect, useCallback } from 'react';
import UserCard from './UserCard';
import { getAllUsers, deleteUser, searchUsers } from '../services/userService';
import { useError } from '../context/ErrorContext';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const { showError } = useError();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(currentPage, limit);
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (err) {
      showError(err.message || 'Failed to fetch users', 'Error Fetching Users');
      console.error('Error fetching users:', err);
      // Set empty arrays on error
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, showError]);

  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await searchUsers(searchTerm);
      setUsers(data.data);
      // Reset pagination when searching
      setPagination({
        totalPages: 1,
        totalUsers: data.count,
        hasNextPage: false,
        hasPrevPage: false,
      });
      setCurrentPage(1);
    } catch (err) {
      showError(err.message || 'Failed to search users', 'Error Searching Users');
      console.error('Error searching users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, showError]);

  // Fetch users when pagination changes or when search is cleared
  useEffect(() => {
    if (!searchTerm.trim()) {
      fetchUsers();
    }
  }, [searchTerm, fetchUsers]);

  // Debounce search input only
  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, handleSearch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      showError(err.message || 'Failed to delete user', 'Error Deleting User');
      console.error('Error deleting user:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing limit
  };

  return (
    <div className="user-list-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users by first or last name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="pagination-controls-top">
        <div className="user-count">
          Showing {users.length} of {pagination.totalUsers} users (Page {currentPage} of {pagination.totalPages})
        </div>
        {!searchTerm && (
          <div className="items-per-page">
            <label htmlFor="limit">Items per page:</label>
            <select id="limit" value={limit} onChange={handleLimitChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        )}
      </div>

      {users.length === 0 ? (
        <div className="no-users">
          <p>No users found</p>
        </div>
      ) : (
        <>
          <div className="user-grid">
            {users.map((user) => (
              <UserCard key={user._id} user={user} onDelete={handleDelete} />
            ))}
          </div>

          {!searchTerm && (
            <div className="pagination-controls">
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </button>

              <div className="pagination-info">
                <span>
                  Page {currentPage} of {pagination.totalPages}
                </span>
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
