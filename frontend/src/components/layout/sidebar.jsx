import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { 
  Home, 
  Clock, 
  BookOpen, 
  CheckSquare, 
  MessageSquare,
  BarChart3,
  LogOut,
  User,
  Smile,
  Briefcase,
  Target,
  Calendar
} from 'lucide-react';

const Sidebar = ({ activePage, setActivePage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = null;
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'pomodoro', label: 'Pomodoro', icon: Clock, path: '/pomodoro' },
    { id: 'notes', label: 'Notes', icon: BookOpen, path: '/notes' },
    { id: 'habits', label: 'Habit Tracker', icon: CheckSquare, path: '/habits' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: MessageSquare, path: '/ai-assistant' },
    { id: 'mood-checker', label: 'Mood Checker', icon: Smile, path: '/mood-checker' },
    { id: 'roadmap', label: 'Career Roadmap', icon: Briefcase, path: '/roadmap' },
    { id: 'subject-analyzer', label: 'Subject Analyzer', icon: Target, path: '/subject-analyzer' },
    { id: 'study-sessions', label: 'Study Sessions', icon: Calendar, path: '/study-sessions' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-20 md:w-64 bg-white shadow-lg rounded-r-2xl flex flex-col"
    >
      <div className="p-4 md:p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <BarChart3 className="text-white" size={24} />
          </div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block text-xl font-bold text-gray-800"
          >
            All In One
          </motion.h1>
        </div>
      </div>

      <nav className="flex-1 mt-8">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-indigo-50'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-8 h-8"
                  >
                    <item.icon size={20} />
                  </motion.div>
                  <span className="hidden md:block ml-3 font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        {currentUser && (
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-10 h-10 rounded-full"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">{currentUser.name}</p>
              <p className="text-xs text-gray-500">{currentUser.email}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="hidden md:block ml-3 font-medium">Logout</span>
        </button>
      </div>

      <div className="p-4 text-center text-xs text-gray-500 hidden md:block">
        © 2023 StudySphere
      </div>
    </motion.div>
  );
};

export default Sidebar;