import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Users from './pages/Users';
import Audit from './pages/Audit';
import About from './pages/About';
import UserForm from './components/UserForm';
import UserDetail from './components/UserDetail';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorNotification from './components/ErrorNotification';
import { ErrorProvider } from './context/ErrorContext';
import { logout, getStoredUser } from './services/authService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <ErrorProvider>
      <Router>
        <div className="App">
          <Navbar user={user} onLogout={handleLogout} />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onLogin={handleLogin} />} />

              {/* Protected Routes */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/new"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <UserForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/edit/:id"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <UserForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:id"
                element={
                  <ProtectedRoute>
                    <UserDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/audit"
                element={
                  <ProtectedRoute>
                    <Audit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <About />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <footer className="footer">
            <p>&copy; 2025, Miko K.</p>
          </footer>

          <ErrorNotification />
        </div>
      </Router>
    </ErrorProvider>
  );
}

const NotFound = () => (
  <div className="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <Link to="/" className="btn btn-primary">
      Go Home
    </Link>
  </div>
);

export default App;
