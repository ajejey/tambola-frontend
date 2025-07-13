import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) {
    return null;
  }

  const baseClasses = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg flex items-center justify-between z-50 animate-slideIn';
  const typeClasses = {
    error: 'bg-red-100 text-red-700 border border-red-200',
    success: 'bg-green-100 text-green-700 border border-green-200',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <p className="mr-4">{message}</p>
      <button onClick={onClose} className="text-2xl font-bold leading-none">&times;</button>
    </div>
  );
};

export default Notification;