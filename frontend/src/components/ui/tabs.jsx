import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/utils';

const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, (child) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, onTabChange: handleTabChange });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, activeTab, onTabChange, className }) => {
  return (
    <div className={cn("flex space-x-1 rounded-lg bg-gray-100 p-1", className)}>
      {React.Children.map(children, (child) => {
        if (child.type === TabsTrigger) {
          return React.cloneElement(child, { 
            isActive: activeTab === child.props.value, 
            onClick: () => onTabChange(child.props.value) 
          });
        }
        return child;
      })}
    </div>
  );
};

const TabsTrigger = ({ children, value, isActive, onClick, className }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 text-sm font-medium rounded-md transition-colors",
        isActive 
          ? "bg-white text-indigo-700 shadow-sm" 
          : "text-gray-600 hover:text-gray-900",
        className
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white rounded-md shadow-sm"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const TabsContent = ({ children, value, activeTab, className }) => {
  if (value !== activeTab) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("mt-4", className)}
    >
      {children}
    </motion.div>
  );
};

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export default Tabs;