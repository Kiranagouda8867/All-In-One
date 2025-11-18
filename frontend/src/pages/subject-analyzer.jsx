import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { subjectSuggestions, subjectCategories } from '../utils/subject-data';
import Card from '../components/ui/card';
import Button from '../components/ui/button';
import { Star, BookOpen, Target, TrendingUp, Plus, Trash2 } from 'lucide-react';

const SubjectAnalyzer = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: '', category: '', rating: 3 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Load subjects from localStorage on mount
  useEffect(() => {
    const savedSubjects = localStorage.getItem('subject-analyzer-subjects');
    if (savedSubjects) {
      try {
        setSubjects(JSON.parse(savedSubjects));
      } catch (e) {
        console.error('Failed to parse subjects from localStorage', e);
      }
    } else {
      // Initialize with mock data
      setSubjects([
        { id: 1, name: 'Calculus', category: 'mathematics', rating: 2 },
        { id: 2, name: 'Physics', category: 'science', rating: 4 },
        { id: 3, name: 'English Literature', category: 'language', rating: 3 }
      ]);
    }
  }, []);

  // Save subjects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('subject-analyzer-subjects', JSON.stringify(subjects));
  }, [subjects]);

  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.category) return;
    
    const subject = {
      id: Date.now(),
      name: newSubject.name,
      category: newSubject.category,
      rating: newSubject.rating
    };
    
    setSubjects([...subjects, subject]);
    setNewSubject({ name: '', category: '', rating: 3 });
    setShowAddForm(false);
  };

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    if (selectedSubject && selectedSubject.id === id) {
      setSelectedSubject(null);
    }
  };

  const handleRatingChange = (id, rating) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, rating } : subject
    ));
    
    if (selectedSubject && selectedSubject.id === id) {
      setSelectedSubject({ ...selectedSubject, rating });
    }
  };

  const getCategoryInfo = (categoryId) => {
    return subjectCategories.find(cat => cat.id === categoryId) || subjectCategories[0];
  };

  const getSuggestions = (rating) => {
    if (rating <= 2) return subjectSuggestions.low;
    if (rating <= 4) return subjectSuggestions.medium;
    return subjectSuggestions.high;
  };

  const getRatingColor = (rating) => {
    if (rating <= 2) return 'text-red-500';
    if (rating <= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRatingLabel = (rating) => {
    if (rating <= 2) return 'Needs Improvement';
    if (rating <= 4) return 'Good';
    return 'Excellent';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Subject Analyzer</h1>
        <p className="text-gray-600 mt-2">Rate your subjects and get personalized suggestions for improvement</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Your Subjects</h2>
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  size="sm"
                  className="p-2"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 bg-gray-50 rounded-xl"
                >
                  <h3 className="font-medium text-gray-800 mb-3">Add New Subject</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                      placeholder="Subject name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                      value={newSubject.category}
                      onChange={(e) => setNewSubject({...newSubject, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select category</option>
                      {subjectCategories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => setNewSubject({...newSubject, rating: star})}
                            className={`p-1 rounded ${newSubject.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                          >
                            <Star size={20} fill={newSubject.rating >= star ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddSubject} size="sm">Add</Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)} size="sm">Cancel</Button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="space-y-3">
                {subjects.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No subjects added yet</p>
                ) : (
                  subjects.map(subject => {
                    const category = getCategoryInfo(subject.category);
                    return (
                      <motion.div
                        key={subject.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedSubject(subject)}
                        className={`p-3 rounded-xl cursor-pointer transition-all ${
                          selectedSubject?.id === subject.id 
                            ? 'bg-indigo-50 border border-indigo-200' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{category.icon}</span>
                            <div>
                              <p className="font-medium text-gray-800">{subject.name}</p>
                              <p className="text-xs text-gray-500">{category.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                  key={star}
                                  size={16}
                                  className={subject.rating >= star ? 'text-yellow-500' : 'text-gray-300'}
                                  fill={subject.rating >= star ? 'currentColor' : 'none'}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRatingChange(subject.id, star);
                                  }}
                                />
                              ))}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubject(subject.id);
                              }}
                              className="ml-2 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedSubject ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <Card.Header>
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">
                      {getCategoryInfo(selectedSubject.category).icon}
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{selectedSubject.name}</h2>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-3">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={18}
                              className={selectedSubject.rating >= star ? 'text-yellow-500' : 'text-gray-300'}
                              fill={selectedSubject.rating >= star ? 'currentColor' : 'none'}
                              onClick={() => handleRatingChange(selectedSubject.id, star)}
                            />
                          ))}
                        </div>
                        <span className={`text-sm font-medium ${getRatingColor(selectedSubject.rating)}`}>
                          {getRatingLabel(selectedSubject.rating)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                      <Target className="mr-2 text-indigo-500" size={20} />
                      Personalized Suggestions
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Based on your rating, here are some suggestions to help you improve:
                    </p>
                    
                    <div className="space-y-4">
                      {getSuggestions(selectedSubject.rating).map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-4 bg-gray-50 rounded-xl"
                        >
                          <h4 className="font-bold text-gray-800 mb-1">{suggestion.title}</h4>
                          <p className="text-gray-600 text-sm mb-3">{suggestion.description}</p>
                          <ul className="space-y-1">
                            {suggestion.actions.map((action, actionIndex) => (
                              <li key={actionIndex} className="flex items-start text-sm text-gray-700">
                                <span className="text-indigo-500 mr-2">•</span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                      <TrendingUp className="mr-2 text-indigo-500" size={20} />
                      Progress Tracking
                    </h3>
                    <div className="p-4 bg-indigo-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Current Rating</span>
                        <span className={`text-sm font-bold ${getRatingColor(selectedSubject.rating)}`}>
                          {selectedSubject.rating}/5
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            selectedSubject.rating <= 2 ? 'bg-red-500' :
                            selectedSubject.rating <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(selectedSubject.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {selectedSubject.rating <= 2 
                          ? "Focus on improving your understanding of core concepts" 
                          : selectedSubject.rating <= 4 
                          ? "You're doing well, keep pushing to master the subject" 
                          : "Excellent work! Consider exploring advanced topics"
                        }
                      </p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          ) : (
            <Card>
              <Card.Content className="flex flex-col items-center justify-center py-12">
                <BookOpen className="text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Subject</h3>
                <p className="text-gray-600 text-center mb-4">
                  Choose a subject from the list to view personalized suggestions and track your progress
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus size={16} className="mr-1" /> Add Subject
                </Button>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectAnalyzer;