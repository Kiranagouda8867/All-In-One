import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/card';
import { Clock, CheckSquare, BookOpen, Calendar } from 'lucide-react';
import { useHabits } from '../../hooks/use-habits';
import { useNotes } from '../../hooks/use-notes';

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
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
};

const StatsGrid = () => {
  const { habits } = useHabits();
  const { notes } = useNotes();

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const notesCount = notes.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        title="Today's Study Time" 
        value="2h 45m" 
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
        value="3:00 PM" 
        icon={Calendar} 
        color="amber" 
        delay={0.4} 
      />
    </div>
  );
};

export default StatsGrid;