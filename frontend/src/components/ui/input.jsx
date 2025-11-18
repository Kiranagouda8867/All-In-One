import React from 'react';
import { motion } from 'framer-motion';

const Input = ({ 
  className = '', 
  ...props 
}) => {
  return (
    <motion.input
      whileFocus={{ scale: 1.01 }}
      className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${className}`}
      {...props}
    />
  );
};

export default Input;