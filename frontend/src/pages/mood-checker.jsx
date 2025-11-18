import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { moodData } from '../utils/mood-data';
import Card from '../components/ui/card';
import Button from '../components/ui/button';
import { Heart, CheckCircle } from 'lucide-react';

const MoodChecker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [saved, setSaved] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);

  // Load mood history from localStorage on mount
  useEffect(() => {
    const savedMoodHistory = localStorage.getItem('mood-history');
    if (savedMoodHistory) {
      try {
        setMoodHistory(JSON.parse(savedMoodHistory));
      } catch (e) {
        console.error('Failed to parse mood history', e);
      }
    }
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setSaved(false);
  };

  const handleSaveMood = () => {
    if (!selectedMood) return;
    
    const newEntry = {
      id: Date.now(),
      mood: selectedMood.id,
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [newEntry, ...moodHistory.slice(0, 9)]; // Keep last 10 entries
    setMoodHistory(updatedHistory);
    localStorage.setItem('mood-history', JSON.stringify(updatedHistory));
    setSaved(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Mood Checker</h1>
        <p className="text-gray-600 mt-2">How are you feeling today? Let us suggest activities based on your mood.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-bold text-gray-800">Select Your Mood</h2>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {moodData.map((mood) => (
                  <motion.button
                    key={mood.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMoodSelect(mood)}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      selectedMood?.id === mood.id
                        ? 'ring-2 ring-indigo-500 bg-indigo-50'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-4xl mb-2">{mood.emoji}</span>
                    <span className="font-medium text-gray-800">{mood.name}</span>
                  </motion.button>
                ))}
              </div>
            </Card.Content>
          </Card>

          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <Card>
                <Card.Header>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2">{selectedMood.emoji}</span>
                    Activities for when you're feeling {selectedMood.name}
                  </h2>
                </Card.Header>
                <Card.Content>
                  <ul className="space-y-3">
                    {selectedMood.activities.map((activity, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${selectedMood.color} flex items-center justify-center`}>
                            <Heart className="text-white" size={14} />
                          </div>
                        </div>
                        <span className="ml-3 text-gray-700">{activity}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <Button 
                      onClick={handleSaveMood}
                      disabled={saved}
                      className="flex items-center"
                    >
                      {saved ? (
                        <>
                          <CheckCircle className="mr-2" size={16} /> Saved
                        </>
                      ) : (
                        'Save My Mood'
                      )}
                    </Button>
                    
                    {saved && (
                      <span className="text-sm text-green-600 flex items-center">
                        <CheckCircle className="mr-1" size={16} /> Mood saved successfully!
                      </span>
                    )}
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          )}
        </div>

        <div>
          <Card>
            <Card.Header>
              <h2 className="text-xl font-bold text-gray-800">Your Mood History</h2>
            </Card.Header>
            <Card.Content>
              {moodHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No mood history yet. Check in with your mood!</p>
              ) : (
                <div className="space-y-3">
                  {moodHistory.map((entry) => {
                    const mood = moodData.find(m => m.id === entry.mood);
                    return (
                      <div key={entry.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl mr-3">{mood?.emoji}</span>
                        <div>
                          <p className="font-medium text-gray-800">{mood?.name}</p>
                          <p className="text-xs text-gray-500">{formatDate(entry.timestamp)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MoodChecker;