import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Generating LUT...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <div className="bg-dark-800 rounded-lg p-8 shadow-2xl flex flex-col items-center space-y-4">
        <div className="loading-spinner" />
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;
