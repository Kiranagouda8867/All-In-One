import React from 'react';
import { motion } from 'framer-motion';
import StatsGrid from '../components/dashboard/stats-card';
import QuoteCard from '../components/dashboard/quote-card';
import Card from '../components/ui/card';
import { Calendar, TrendingUp, BookOpen, Target, Smile, Briefcase, Clock } from 'lucide-react';
import { moodData } from '../utils/mood-data';
import { careerPaths } from '../utils/career-data';
import { Link } from 'react-router-dom';
import useSessions from '../hooks/use-sessions';

// Render the next up to 3 upcoming sessions from DB
const StudySessionsList = () => {
  const { sessions } = useSessions();

  const now = new Date();
  const upcoming = (sessions || [])
    .filter(s => s.startTime && new Date(s.startTime) > now)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 3);

  const formatRelativeDay = (dt) => {
    if (!dt) return '';
    const d = new Date(dt);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const badgeColors = [
    { text: 'text-indigo-600', bg: 'bg-indigo-100' },
    { text: 'text-emerald-600', bg: 'bg-emerald-100' },
    { text: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  if (!upcoming || upcoming.length === 0) {
    return <div className="text-sm text-gray-500">No upcoming sessions</div>;
  }

  return (
    <div className="space-y-3">
      {upcoming.map((s, idx) => {
        const col = badgeColors[idx % badgeColors.length];
        return (
          <Link to={`/study-sessions?session=${s.id}`} key={s.id}>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-800">{s.title}</p>
                <p className="text-xs text-gray-500">{formatRelativeDay(s.startTime)}, {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <span className={`text-sm font-medium ${col.text} ${col.bg} px-2 py-1 rounded-full`}>Upcoming</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your productivity overview.</p>
      </motion.div>

      <StatsGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Upcoming Study Sessions removed per request */}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Card>
              <Card.Header>
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <TrendingUp className="mr-2 text-indigo-500" size={20} />
                  Weekly Progress
                </h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Study Goal</span>
                      <span className="text-sm font-medium text-gray-700">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Habit Completion</span>
                      <span className="text-sm font-medium text-gray-700">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Notes Created</span>
                      <span className="text-sm font-medium text-gray-700">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <Card>
              <Card.Header>
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Target className="mr-2 text-indigo-500" size={20} />
                  Subject Analyzer
                </h2>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">Quickly rate your subjects and get suggestions.</p>
                <div className="flex items-center justify-between">
                  <Link to="/subject-analyzer">
                    <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                      Open Analyzer
                    </button>
                  </Link>
                  <Link to="/subject-analyzer" className="text-sm text-indigo-600 hover:underline">View</Link>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <QuoteCard />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <Card>
              <Card.Header>
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Clock className="mr-2 text-indigo-500" size={20} />
                  Study Sessions
                </h2>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">Plan your study sessions and get reminders</p>
                {/* realtime upcoming sessions from DB */}
                <StudySessionsList />
                <div className="mt-4">
                  <Link to="/study-sessions">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      View All Sessions
                    </button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          >
            <Card>
              <Card.Header>
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Smile className="mr-2 text-indigo-500" size={20} />
                  Mood Check-in
                </h2>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">How are you feeling today?</p>
                <div className="flex flex-wrap gap-2">
                  {moodData.slice(0, 6).map((mood) => (
                    <Link to="/mood-checker" key={mood.id}>
                      <button
                        className="text-2xl p-2 rounded-lg hover:bg-gray-100"
                        title={mood.name}
                      >
                        {mood.emoji}
                      </button>
                    </Link>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to="/mood-checker">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Full Mood Checker
                    </button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;