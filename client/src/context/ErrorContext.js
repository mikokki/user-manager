import React, { createContext, useContext, useState, useCallback } from 'react';

const ErrorContext = createContext();

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = useCallback((errorMessage, title = 'Error') => {
    // Handle different error formats
    let message = errorMessage;

    if (typeof errorMessage === 'object') {
      // Handle API error responses
      if (errorMessage.message) {
        message = errorMessage.message;
      } else if (errorMessage.error) {
        message = errorMessage.error;
      } else {
        message = JSON.stringify(errorMessage);
      }
    }

    setError({
      title,
      message,
      timestamp: new Date(),
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    error,
    showError,
    clearError,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContext;
