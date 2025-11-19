import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/card';
import { Clock, CheckSquare, BookOpen, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHabits } from '../../hooks/use-habits';
import { useNotes } from '../../hooks/use-notes';
import useSessions from '../../hooks/use-sessions';

const StatsCard = ({ title, value, icon: Icon, color, delay = 0 }) => {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="h-full">
        <Card.Content className="flex items-center">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="text-white" size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">{title}</p>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
};

const StatsGrid = () => {
  const { habits } = useHabits();
  const { notes } = useNotes();

  const { sessions } = useSessions();

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const notesCount = notes.length;

  // compute today's study time (sum durations of completed sessions today)
  const isToday = (dt) => {
    if (!dt) return false;
    const d = new Date(dt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

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

  const msToHM = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const todaysMinutes = sessions
    .filter(s => isToday(s.startTime) && s.completed)
    .reduce((sum, s) => sum + (s.duration || 0), 0);

  // compute next upcoming session based on current time
  const now = new Date();
  const upcoming = sessions
    .filter(s => {
      const st = s.startTime ? new Date(s.startTime) : null;
      return st && st > now;
    })
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  const nextSession = upcoming.length > 0 ? upcoming[0] : null;
  const nextSessionValue = nextSession ? (
    <div className="space-y-2">
      <div className="flex items-center justify-between bg-gray-50 rounded p-3">
        <div>
          <div className="font-medium text-sm text-gray-900">
            <Link to={`/study-sessions?session=${nextSession.id}`} className="hover:underline">{nextSession.title}</Link>
          </div>
          <div className="text-xs text-gray-500">{formatRelativeDay(nextSession.startTime)}, {new Date(nextSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        
      </div>
      <div className="mt-1 text-xs text-gray-500">
        <a href="/study-sessions" className="underline">View All Sessions</a>
      </div>
    </div>
  ) : 'None';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        title="Today's Study Time" 
        value={msToHM(todaysMinutes)} 
        icon={Clock} 
        color="indigo" 
        delay={0.1} 
      />
      <StatsCard 
        title="Habits Completed" 
        value={`${completedToday}/${totalHabits}`} 
        icon={CheckSquare} 
        color="emerald" 
        delay={0.2} 
      />
      <StatsCard 
        title="Notes Saved" 
        value={notesCount} 
        icon={BookOpen} 
        color="purple" 
        delay={0.3} 
      />
      <StatsCard 
        title="Next Study Session" 
        value={nextSessionValue} 
        icon={Calendar} 
        color="amber" 
        delay={0.4} 
      />
    </div>
  );
};

export default StatsGrid;