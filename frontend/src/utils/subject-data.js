export const subjectSuggestions = {
  // Suggestions for low ratings (1-2)
  low: [
    {
      title: "Review Fundamentals",
      description: "Go back to the basics and strengthen your foundation",
      actions: [
        "Review lecture notes from the beginning of the semester",
        "Watch introductory video tutorials",
        "Complete practice problems on core concepts"
      ]
    },
    {
      title: "Seek Additional Help",
      description: "Don't hesitate to ask for assistance",
      actions: [
        "Schedule a meeting with your professor or TA",
        "Join a study group for this subject",
        "Consider hiring a tutor if needed"
      ]
    },
    {
      title: "Adjust Study Methods",
      description: "Try different learning approaches",
      actions: [
        "Use visual aids like diagrams and mind maps",
        "Teach the concepts to someone else",
        "Apply knowledge through practical projects"
      ]
    }
  ],
  // Suggestions for medium ratings (3-4)
  medium: [
    {
      title: "Deepen Understanding",
      description: "Move beyond memorization to true comprehension",
      actions: [
        "Connect concepts to real-world applications",
        "Explore advanced topics beyond the curriculum",
        "Participate in class discussions more actively"
      ]
    },
    {
      title: "Practice Application",
      description: "Apply what you've learned in different contexts",
      actions: [
        "Work on challenging problem sets",
        "Participate in competitions or projects",
        "Find interdisciplinary connections"
      ]
    },
    {
      title: "Teach Others",
      description: "Solidify your knowledge by teaching",
      actions: [
        "Form a study group and take turns explaining concepts",
        "Create study materials for classmates",
        "Tutor students who are struggling"
      ]
    }
  ],
  // Suggestions for high ratings (5)
  high: [
    {
      title: "Explore Advanced Topics",
      description: "Challenge yourself beyond the curriculum",
      actions: [
        "Read research papers in the field",
        "Take online courses on advanced topics",
        "Work on independent research projects"
      ]
    },
    {
      title: "Apply Knowledge Creatively",
      description: "Use your knowledge in innovative ways",
      actions: [
        "Start a personal project related to the subject",
        "Enter competitions or hackathons",
        "Contribute to open-source projects"
      ]
    },
    {
      title: "Share Your Expertise",
      description: "Help others while reinforcing your own learning",
      actions: [
        "Become a teaching assistant or peer tutor",
        "Write blog posts or create videos explaining concepts",
        "Mentor younger students in the subject"
      ]
    }
  ]
};

export const subjectCategories = [
  { id: 'mathematics', name: 'Mathematics', icon: '🧮', color: 'from-blue-500 to-cyan-500' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'from-green-500 to-emerald-500' },
  { id: 'language', name: 'Language', icon: '📚', color: 'from-purple-500 to-indigo-500' },
  { id: 'history', name: 'History', icon: '🏛️', color: 'from-amber-500 to-orange-500' },
  { id: 'arts', name: 'Arts', icon: '🎨', color: 'from-pink-500 to-rose-500' },
  { id: 'technology', name: 'Technology', icon: '💻', color: 'from-gray-600 to-gray-800' }
];