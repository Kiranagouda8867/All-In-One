import React from 'react';
import { motion } from 'framer-motion';
import { useAIChat } from '../hooks/use-ai-chat';
import ChatMessage from '../components/ai-assistant/chat-message';
import ChatInput from '../components/ai-assistant/chat-input';
import Card from '../components/ui/card';
import { Bot, Lightbulb, BookOpen, Clock } from 'lucide-react';

const AIAssistant = () => {
  const {
    messages,
    isLoading,
    sendMessage,
    messagesEndRef
  } = useAIChat();
  
  const quickQuestions = [
    "How can I improve my focus?",
    "What's the best way to take notes?",
    "Help me create a study schedule",
    "How do I stop procrastinating?"
  ];
  
  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800">AI Study Assistant</h1>
        <p className="text-gray-600 mt-2">Your personal AI tutor for study tips and productivity advice</p>
      </motion.div>
      
      <div className="flex-1 flex flex-col md:flex-row gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="md:w-1/3 space-y-6"
        >
          <Card>
            <Card.Header>
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <Bot className="mr-2 text-indigo-500" size={20} />
                About Your Assistant
              </h2>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600 mb-4">
                I'm your AI study assistant, here to help you with study techniques, time management, note-taking strategies, and more.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 flex-shrink-0">
                    <Lightbulb className="text-indigo-600" size={14} />
                  </div>
                  <p className="text-sm text-gray-600">Study tips and techniques</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 flex-shrink-0">
                    <Clock className="text-indigo-600" size={14} />
                  </div>
                  <p className="text-sm text-gray-600">Time management strategies</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 flex-shrink-0">
                    <BookOpen className="text-indigo-600" size={14} />
                  </div>
                  <p className="text-sm text-gray-600">Note-taking methods</p>
                </div>
              </div>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Header>
              <h2 className="text-lg font-bold text-gray-800">Quick Questions</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    disabled={isLoading}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </Card.Content>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="md:w-2/3 flex flex-col"
        >
          <Card className="flex-1 flex flex-col">
            <Card.Header className="pb-3">
              <h2 className="text-lg font-bold text-gray-800">Conversation</h2>
            </Card.Header>
            
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isUser={message.isUser}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AIAssistant;