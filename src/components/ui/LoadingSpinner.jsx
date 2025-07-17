import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`loading-spinner ${size} ${className}`}>
    </div>
  );
};

export default LoadingSpinner;