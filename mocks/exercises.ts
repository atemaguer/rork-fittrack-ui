export const EXERCISE_LIST = [
  { name: 'Bench Press', category: 'strength' as const },
  { name: 'Squats', category: 'strength' as const },
  { name: 'Deadlift', category: 'strength' as const },
  { name: 'Overhead Press', category: 'strength' as const },
  { name: 'Barbell Row', category: 'strength' as const },
  { name: 'Pull-ups', category: 'strength' as const },
  { name: 'Dumbbell Curl', category: 'strength' as const },
  { name: 'Tricep Dips', category: 'strength' as const },
  { name: 'Leg Press', category: 'strength' as const },
  { name: 'Lat Pulldown', category: 'strength' as const },
  { name: 'Running', category: 'cardio' as const },
  { name: 'Cycling', category: 'cardio' as const },
  { name: 'Swimming', category: 'cardio' as const },
  { name: 'Jump Rope', category: 'cardio' as const },
  { name: 'Yoga', category: 'flexibility' as const },
  { name: 'Stretching', category: 'flexibility' as const },
];

export const WORKOUT_TEMPLATES = [
  {
    id: 'push',
    name: 'Push Day',
    exercises: [
      { name: 'Bench Press', category: 'strength' as const },
      { name: 'Overhead Press', category: 'strength' as const },
      { name: 'Tricep Dips', category: 'strength' as const },
    ],
  },
  {
    id: 'pull',
    name: 'Pull Day',
    exercises: [
      { name: 'Pull-ups', category: 'strength' as const },
      { name: 'Barbell Row', category: 'strength' as const },
      { name: 'Dumbbell Curl', category: 'strength' as const },
    ],
  },
  {
    id: 'legs',
    name: 'Leg Day',
    exercises: [
      { name: 'Squats', category: 'strength' as const },
      { name: 'Deadlift', category: 'strength' as const },
      { name: 'Leg Press', category: 'strength' as const },
    ],
  },
];
