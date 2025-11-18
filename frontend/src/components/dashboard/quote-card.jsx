import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/card';
import Button from '../ui/button';
import { Quote, RefreshCw } from 'lucide-react';

const quotes = [
  "The secret of getting ahead is getting started.",
  "It's hard to beat a person who never gives up.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future depends on what you do today.",
  "Believe you can and you're halfway there.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "You don't have to be great to start, but you have to start to be great."
];

const QuoteCard = () => {
  const [currentQuote, setCurrentQuote] = useState('');

  useEffect(() => {
    getRandomQuote();
  }, []);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <Card.Content className="flex items-start">
          <Quote className="mt-1 mr-4 text-indigo-200" size={24} />
          <div className="flex-1">
            <p className="text-lg italic mb-4">"{currentQuote}"</p>
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={getRandomQuote}
                className="text-white hover:bg-indigo-400"
              >
                <RefreshCw size={16} className="mr-1" /> New Quote
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
};

export default QuoteCard;