// Categories used by StudySessions (plain JS, no JSX)
export const sessionCategories = [
  { id: 'lecture', name: 'Lecture', icon: '📖' },
  { id: 'revision', name: 'Revision', icon: '🔁' },
  { id: 'practice', name: 'Practice', icon: '🧪' },
  { id: 'group', name: 'Group Study', icon: '👥' },
  { id: 'project', name: 'Project Work', icon: '🗂️' }
];

// Reminder options (id, label shown in UI, minutes used for calculations)
export const reminderOptions = [
  { id: 'none', label: 'None', minutes: 0 },
  { id: '5min', label: '5 minutes before', minutes: 5 },
  { id: '10min', label: '10 minutes before', minutes: 10 },
  { id: '15min', label: '15 minutes before', minutes: 15 },
  { id: '30min', label: '30 minutes before', minutes: 30 },
  { id: '1hr', label: '1 hour before', minutes: 60 }
];

export default {
  sessionCategories,
  reminderOptions
};
