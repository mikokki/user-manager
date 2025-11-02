import React from 'react';
import { Link } from 'react-router-dom';
import UserList from '../components/UserList';

const Users = () => {
  return (
    <div className="users-page">
      <div className="page-header">
        <h1>User Management</h1>
        <Link to="/users/new" className="btn btn-primary">
          Add New User
        </Link>
      </div>

      <UserList />
    </div>
  );
};

export default Users;
