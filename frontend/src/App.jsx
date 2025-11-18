import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from './components/layout/sidebar';
import Dashboard from './pages/dashboard';
import Pomodoro from './pages/pomodoro';
import Notes from './pages/notes';
import Habits from './pages/habits';
import AIAssistant from './pages/ai-assistant';
import MoodChecker from './pages/mood-checker';
import Roadmap from './pages/roadmap';
import SubjectAnalyzer from './pages/subject-analyzer';
import StudySessions from './pages/study-sessions';
import Login from './pages/login';
import Register from './pages/register';
import './index.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  // (debug logs removed)

    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* App shell routes (no auth) */}
            <Route
              path="/*"
              element={
            <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
              
              <Sidebar activePage={activePage} setActivePage={setActivePage} />
              
              <main className="flex-1 p-4 md:p-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/pomodoro" element={<Pomodoro />} />
                        <Route path="/notes" element={<Notes />} />
                        <Route path="/habits" element={<Habits />} />
                        <Route path="/ai-assistant" element={<AIAssistant />} />
                        <Route path="/mood-checker" element={<MoodChecker />} />
                        <Route path="/roadmap" element={<Roadmap />} />
                        <Route path="/subject-analyzer" element={<SubjectAnalyzer />} />
                        <Route path="/study-sessions" element={<StudySessions />} />
                    </Routes>
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
            }
            />
        </Routes>
      </Router>
    );
}

export default App;