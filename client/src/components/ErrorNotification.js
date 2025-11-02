import React, { useEffect } from 'react';
import { useError } from '../context/ErrorContext';
import './ErrorNotification.css';

const ErrorNotification = () => {
  const { error, clearError } = useError();

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!error) {
    return null;
  }

  return (
    <div className="error-notification-overlay">
      <div className="error-notification">
        <div className="error-notification-header">
          <h3>{error.title}</h3>
          <button
            className="error-notification-close"
            onClick={clearError}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="error-notification-body">
          <p>{error.message}</p>
        </div>
        <div className="error-notification-footer">
          <button className="btn btn-primary" onClick={clearError}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;
