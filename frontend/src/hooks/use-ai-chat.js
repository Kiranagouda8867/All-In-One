import { useState, useEffect, useRef } from 'react';

// Mock AI responses based on keywords
const getAIResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm your AI study assistant. How can I help you today?";
  }
  
  if (lowerMessage.includes('pomodoro') || lowerMessage.includes('timer')) {
    return "The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. It's a great way to maintain focus and prevent burnout!";
  }
  
  if (lowerMessage.includes('note') || lowerMessage.includes('notes')) {
    return "Taking effective notes is crucial for learning. Try using the Cornell method, mind mapping, or outline format. Review your notes within 24 hours to improve retention. Would you like more specific note-taking strategies?";
  }
  
  if (lowerMessage.includes('habit') || lowerMessage.includes('routine')) {
    return "Building good study habits takes time and consistency. Start small, be specific about your habits, and track your progress. Remember that it typically takes 21-66 days to form a new habit. What habit are you trying to build?";
  }
  
  if (lowerMessage.includes('focus') || lowerMessage.includes('concentrate')) {
    return "To improve focus, try eliminating distractions, using the Pomodoro Technique, taking regular breaks, and ensuring you're well-rested. Meditation and mindfulness exercises can also help improve your concentration over time.";
  }
  
  if (lowerMessage.includes('motivat') || lowerMessage.includes('procrastinat')) {
    return "Staying motivated can be challenging! Try setting clear, achievable goals, breaking large tasks into smaller steps, rewarding yourself for progress, and finding an accountability partner. Remember why you started your studies in the first place!";
  }
  
  if (lowerMessage.includes('study') && lowerMessage.includes('tip')) {
    return "Here are some effective study tips: 1) Use active recall instead of passive review, 2) Space out your study sessions over time, 3) Teach the material to someone else, 4) Use mnemonics for memorization, and 5) Get enough sleep to consolidate your learning.";
  }
  
  if (lowerMessage.includes('exam') || lowerMessage.includes('test')) {
    return "To prepare for exams, start early, create a study schedule, practice with past papers, study in a group, and take care of your health. Make sure to get a good night's sleep before the exam and arrive early to reduce stress.";
  }
  
  // Default response
  return "That's a great question! As your AI study assistant, I'm here to help with study techniques, time management, note-taking strategies, and more. Could you provide more details about what you'd like to know?";
};

export const useAIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! I'm your AI study assistant. How can I help you today?",
      timestamp: new Date(),
      isUser: false
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const sendMessage = (content) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      content,
      timestamp: new Date(),
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Add "thinking" message
    const thinkingMessage = {
      id: Date.now() + 1,
      content: 'thinking',
      timestamp: new Date(),
      isUser: false
    };
    
    setMessages(prev => [...prev, thinkingMessage]);
    
    // Simulate AI thinking time
    setTimeout(() => {
      // Remove thinking message and add AI response
      const aiResponse = getAIResponse(content);
      const aiMessage = {
        id: Date.now() + 2,
        content: aiResponse,
        timestamp: new Date(),
        isUser: false
      };
      
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.content !== 'thinking');
        return [...filtered, aiMessage];
      });
      
      setIsLoading(false);
    }, 1500);
  };
  
  return {
    messages,
    isLoading,
    sendMessage,
    messagesEndRef
  };
};