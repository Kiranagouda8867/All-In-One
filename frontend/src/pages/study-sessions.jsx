import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sessionCategories, reminderOptions } from '../utils/study-session-data';
import Card from '../components/ui/card';
import Button from '../components/ui/button';
import { Calendar, Clock, Plus, Trash2, CheckCircle, Bell, Edit } from 'lucide-react';

const StudySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    category: 'lecture',
    startTime: '',
    duration: 60,
    reminder: '10min',
    completed: false
  });

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('study-sessions');
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error('Failed to parse sessions from localStorage', e);
      }
    } else {
      // Initialize with mock data
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setSessions([
        {
          id: 1,
          title: 'Mathematics - Calculus',
          description: 'Chapter 5: Integration techniques',
          category: 'lecture',
          startTime: today.toISOString().slice(0, 16),
          duration: 90,
          reminder: '10min',
          completed: false
        },
        {
          id: 2,
          title: 'Physics - Quantum Mechanics',
          description: 'Review wave-particle duality',
          category: 'revision',
          startTime: tomorrow.toISOString().slice(0, 16),
          duration: 60,
          reminder: '15min',
          completed: false
        }
      ]);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('study-sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Check for reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkReminders();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [sessions]);

  const checkReminders = () => {
    const now = new Date();
    
    sessions.forEach(session => {
      if (session.completed) return;
      
      const sessionTime = new Date(session.startTime);
      const reminderTime = new Date(sessionTime.getTime() - getReminderMinutes(session.reminder) * 60000);
      
      // Check if current time is within 1 minute of reminder time
      if (Math.abs(now - reminderTime) < 60000) {
        showNotification(session);
      }
    });
  };

  const showNotification = (session) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Study Session Reminder', {
        body: `Your session "${session.title}" starts soon!`,
        icon: '/favicon.ico'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Study Session Reminder', {
            body: `Your session "${session.title}" starts soon!`,
            icon: '/favicon.ico'
          });
        }
      });
    }
  };

  const getReminderMinutes = (reminderId) => {
    const option = reminderOptions.find(opt => opt.id === reminderId);
    return option ? option.minutes : 0;
  };

  const handleAddSession = () => {
    if (!newSession.title || !newSession.startTime) return;
    
    const session = {
      id: editingSession ? editingSession.id : Date.now(),
      ...newSession,
      completed: editingSession ? editingSession.completed : false
    };
    
    if (editingSession) {
      setSessions(sessions.map(s => s.id === editingSession.id ? session : s));
    } else {
      setSessions([...sessions, session]);
    }
    
    resetForm();
    setShowAddForm(false);
    setEditingSession(null);
  };

  const handleEditSession = (session) => {
    setNewSession({
      title: session.title,
      description: session.description,
      category: session.category,
      startTime: session.startTime,
      duration: session.duration,
      reminder: session.reminder,
      completed: session.completed
    });
    setEditingSession(session);
    setShowAddForm(true);
  };

  const handleDeleteSession = (id) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const handleToggleComplete = (id) => {
    setSessions(sessions.map(session => 
      session.id === id ? { ...session, completed: !session.completed } : session
    ));
  };

  const resetForm = () => {
    setNewSession({
      title: '',
      description: '',
      category: 'lecture',
      startTime: '',
      duration: 60,
      reminder: '10min',
      completed: false
    });
  };

  const getCategoryInfo = (categoryId) => {
    return sessionCategories.find(cat => cat.id === categoryId) || sessionCategories[0];
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEndTime = (startTime, duration) => {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    return end.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (startTime) => {
    return new Date(startTime) > new Date();
  };

  const isToday = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Group sessions by date
  const groupedSessions = sessions.reduce((groups, session) => {
    const date = new Date(session.startTime).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedSessions).sort((a, b) => 
    new Date(a) - new Date(b)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Study Sessions</h1>
          <p className="text-gray-600 mt-2">Plan your study sessions and get reminders</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus size={16} className="mr-1" /> New Session
        </Button>
      </motion.div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Card>
            <Card.Header>
              <h2 className="text-xl font-bold text-gray-800">
                {editingSession ? 'Edit Study Session' : 'Create New Study Session'}
              </h2>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newSession.title}
                    onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                    placeholder="e.g., Mathematics - Calculus"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newSession.category}
                    onChange={(e) => setNewSession({...newSession, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {sessionCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={newSession.startTime}
                    onChange={(e) => setNewSession({...newSession, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="240"
                    value={newSession.duration}
                    onChange={(e) => setNewSession({...newSession, duration: parseInt(e.target.value) || 60})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newSession.description}
                    onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                    placeholder="What will you study in this session?"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder
                  </label>
                  <select
                    value={newSession.reminder}
                    onChange={(e) => setNewSession({...newSession, reminder: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {reminderOptions.map(option => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => {
                  setShowAddForm(false);
                  setEditingSession(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddSession}>
                  {editingSession ? 'Update Session' : 'Create Session'}
                </Button>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      )}

      {sortedDates.length === 0 ? (
        <Card>
          <Card.Content className="flex flex-col items-center justify-center py-12">
            <Calendar className="text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Study Sessions</h3>
            <p className="text-gray-600 text-center mb-4">
              Create your first study session to get started
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus size={16} className="mr-1" /> Create Session
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                {isToday(date) ? 'Today' : new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedSessions[date].map(session => {
                  const category = getCategoryInfo(session.category);
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className={`h-full ${session.completed ? 'opacity-75' : ''}`}>
                        <Card.Header className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <span className="text-2xl mr-2">{category.icon}</span>
                              <div>
                                <h3 className={`font-bold ${session.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                  {session.title}
                                </h3>
                                <p className="text-xs text-gray-500">{category.name}</p>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEditSession(session)}
                                className="p-1 text-gray-400 hover:text-indigo-600"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteSession(session.id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </Card.Header>
                        <Card.Content>
                          {session.description && (
                            <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                          )}
                          
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="mr-2" size={14} />
                              {formatDateTime(session.startTime)} - {getEndTime(session.startTime, session.duration)}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600">
                              <Bell className="mr-2" size={14} />
                              {reminderOptions.find(opt => opt.id === session.reminder)?.label}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              session.completed 
                                ? 'bg-green-100 text-green-800' 
                                : isUpcoming(session.startTime) 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {session.completed ? 'Completed' : isUpcoming(session.startTime) ? 'Upcoming' : 'Past'}
                            </span>
                            
                            <button
                              onClick={() => handleToggleComplete(session.id)}
                              className={`p-2 rounded-lg ${
                                session.completed 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <CheckCircle size={16} fill={session.completed ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </Card.Content>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudySessions;