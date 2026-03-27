export interface ExerciseSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility';
  sets: ExerciseSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  date: string;
  title: string;
  duration: number;
  exercises: Exercise[];
  totalVolume: number;
  completed: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Omit<Exercise, 'id' | 'sets'>[];
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  goal: string;
}
