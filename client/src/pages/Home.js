import React from 'react';
import { Link } from 'react-router-dom';
import { seedUsers } from '../services/userService';
import { useError } from '../context/ErrorContext';

const Home = ({ user }) => {
  const [seeding, setSeeding] = React.useState(false);
  const [message, setMessage] = React.useState(null);
  const { showError } = useError();

  const handleSeedDatabase = async () => {
    if (window.confirm('This will clear all existing users and add 10 dummy users. Continue?')) {
      try {
        setSeeding(true);
        const response = await seedUsers();
        setMessage({
          type: 'success',
          text: `${response.count} users seeded successfully!`,
        });
        setTimeout(() => setMessage(null), 5000);
      } catch (err) {
        showError(err.message || 'Failed to seed database', 'Seed Database Error');
      } finally {
        setSeeding(false);
      }
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>
          {user
            ? `Welcome back, ${user.firstName}!`
            : 'Welcome to User Manager'}
        </h1>
        <p className="subtitle">
          A full-stack application for managing users
        </p>

        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        {user ? (
          <div className="hero-actions">
            {user.role === 'admin' ? (
              <>
                <Link to="/users" className="btn btn-primary btn-large">
                  View All Users
                </Link>
                <Link to="/users/new" className="btn btn-success btn-large">
                  Add New User
                </Link>
                <button
                  onClick={handleSeedDatabase}
                  className="btn btn-secondary btn-large"
                  disabled={seeding}
                >
                  {seeding ? 'Seeding...' : 'Seed Database'}
                </button>
              </>
            ) : (
              <Link to="/profile" className="btn btn-primary btn-large">
                View My Profile
              </Link>
            )}
          </div>
        ) : (
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary btn-large">
              Login
            </Link>
            <Link to="/register" className="btn btn-success btn-large">
              Register
            </Link>
          </div>
        )}
      </div>

      <div className="tech-stack-section">
        <h2>Built With</h2>
        <div className="tech-list">
          <span className="tech-badge">React</span>
          <span className="tech-badge">Node.js</span>
          <span className="tech-badge">Express</span>
          <span className="tech-badge">MongoDB</span>
          <span className="tech-badge">Mongoose</span>
          <span className="tech-badge">React Router</span>
          <span className="tech-badge">Axios</span>
          <span className="tech-badge">JWT</span>
          <span className="tech-badge">bcrypt</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
