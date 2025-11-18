import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { careerPaths } from '../utils/career-data';
import Card from '../components/ui/card';
import Button from '../components/ui/button';
import { Briefcase, BookOpen, ExternalLink, CheckCircle } from 'lucide-react';

const Roadmap = () => {
  const [selectedCareer, setSelectedCareer] = useState(careerPaths[0]);
  const [completedPhases, setCompletedPhases] = useState([]);

  const handleCareerSelect = (career) => {
    setSelectedCareer(career);
    // Reset completed phases when changing career
    setCompletedPhases([]);
  };

  const togglePhaseCompletion = (phaseIndex) => {
    if (completedPhases.includes(phaseIndex)) {
      setCompletedPhases(completedPhases.filter(i => i !== phaseIndex));
    } else {
      setCompletedPhases([...completedPhases, phaseIndex]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Career Roadmap Generator</h1>
        <p className="text-gray-600 mt-2">Choose a career path and get a personalized roadmap to achieve your goals</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-bold text-gray-800">Career Paths</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {careerPaths.map((career) => (
                  <motion.button
                    key={career.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCareerSelect(career)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedCareer.id === career.id
                        ? 'bg-gradient-to-r ' + career.color + ' text-white shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{career.icon}</span>
                      <div>
                        <p className="font-medium">{career.name}</p>
                        <p className={`text-xs ${selectedCareer.id === career.id ? 'text-white/80' : 'text-gray-500'}`}>
                          {career.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <Card.Header>
              <div className="flex items-center">
                <span className="text-3xl mr-3">{selectedCareer.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedCareer.name} Roadmap</h2>
                  <p className="text-gray-600">{selectedCareer.description}</p>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-8">
                {selectedCareer.roadmap.map((phase, index) => {
                  const isCompleted = completedPhases.includes(index);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`border-l-4 pl-6 ${isCompleted ? 'border-green-500' : 'border-gray-300'}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-bold text-gray-800">{phase.phase}</h3>
                            {isCompleted && (
                              <CheckCircle className="ml-2 text-green-500" size={20} />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">Duration: {phase.duration}</p>
                        </div>
                        <Button
                          variant={isCompleted ? "outline" : "default"}
                          size="sm"
                          onClick={() => togglePhaseCompletion(index)}
                          className={isCompleted ? "border-green-300 text-green-700" : ""}
                        >
                          {isCompleted ? "Completed" : "Mark Complete"}
                        </Button>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                          <Briefcase className="mr-2 text-indigo-500" size={16} />
                          Key Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                          <BookOpen className="mr-2 text-indigo-500" size={16} />
                          Learning Resources
                        </h4>
                        <div className="space-y-3">
                          {phase.resources.map((resource, resourceIndex) => (
                            <div key={resourceIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-800">{resource.title}</p>
                                <p className="text-sm text-gray-600">{resource.type}</p>
                              </div>
                              <a
                                href={resource.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800"
                              >
                                <ExternalLink size={18} />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;