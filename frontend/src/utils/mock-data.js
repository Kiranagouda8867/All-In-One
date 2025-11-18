export const mockQuotes = [
  "The secret of getting ahead is getting started.",
  "It's hard to beat a person who never gives up.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future depends on what you do today.",
  "Believe you can and you're halfway there.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "You don't have to be great to start, but you have to start to be great."
];

export const mockHabits = [
  {
    id: 1,
    name: 'Morning Meditation',
    description: '10 minutes of mindfulness meditation',
    goalStreak: 30,
    frequency: 'daily',
    currentStreak: 7,
    bestStreak: 14,
    completedToday: true,
    createdAt: '2023-09-15T08:00:00Z',
    lastCompleted: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Read for 30 minutes',
    description: 'Read educational material',
    goalStreak: 21,
    frequency: 'daily',
    currentStreak: 3,
    bestStreak: 10,
    completedToday: false,
    createdAt: '2023-09-20T09:30:00Z',
    lastCompleted: '2023-10-13T09:30:00Z'
  },
  {
    id: 3,
    name: 'Exercise',
    description: 'Physical activity for at least 20 minutes',
    goalStreak: 14,
    frequency: 'daily',
    currentStreak: 5,
    bestStreak: 8,
    completedToday: false,
    createdAt: '2023-09-25T07:00:00Z',
    lastCompleted: '2023-10-14T07:00:00Z'
  }
];

export const mockNotes = [
  {
    id: 1,
    title: 'Physics Lecture Notes',
    content: 'Today we covered quantum mechanics and the principles of wave-particle duality. Key concepts include the Heisenberg uncertainty principle and Schrödinger equation.',
    tags: ['Physics', 'Quantum Mechanics'],
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-10-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'Calculus Study Guide',
    content: 'Derivatives and integrals are fundamental concepts in calculus. Remember the chain rule for derivatives and integration by parts for complex integrals.',
    tags: ['Mathematics', 'Calculus'],
    createdAt: '2023-10-14T15:45:00Z',
    updatedAt: '2023-10-14T15:45:00Z'
  },
  {
    id: 3,
    title: 'Computer Science Algorithms',
    content: 'Sorting algorithms: Bubble sort has O(n²) time complexity, while merge sort and quick sort have O(n log n) average time complexity.',
    tags: ['Computer Science', 'Algorithms'],
    createdAt: '2023-10-13T09:15:00Z',
    updatedAt: '2023-10-13T09:15:00Z'
  }
];

export const mockStudySessions = [
  { time: '3:00 PM - 4:30 PM', subject: 'Mathematics', topic: 'Calculus' },
  { time: '5:00 PM - 6:00 PM', subject: 'Physics', topic: 'Quantum Mechanics' },
  { time: '7:30 PM - 9:00 PM', subject: 'Computer Science', topic: 'Data Structures' }
];