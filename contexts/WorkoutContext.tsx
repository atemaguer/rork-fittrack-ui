import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';

import type { Workout, UserProfile } from '@/types/workout';

const WORKOUTS_KEY = 'workouts';
const PROFILE_KEY = 'profile';

export const [WorkoutContext, useWorkouts] = createContextHook(() => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Athlete',
    weight: 70,
    height: 175,
    goal: 'Build muscle',
  });

  const workoutsQuery = useQuery({
    queryKey: ['workouts'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(WORKOUTS_KEY);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(PROFILE_KEY);
      return stored ? JSON.parse(stored) : {
        name: 'Athlete',
        weight: 70,
        height: 175,
        goal: 'Build muscle',
      };
    },
  });

  const saveWorkoutsMutation = useMutation({
    mutationFn: async (workouts: Workout[]) => {
      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
      return workouts;
    },
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (profile: UserProfile) => {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      return profile;
    },
  });

  useEffect(() => {
    if (workoutsQuery.data) {
      setWorkouts(workoutsQuery.data);
    }
  }, [workoutsQuery.data]);

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
    }
  }, [profileQuery.data]);

  const addWorkout = (workout: Workout) => {
    const updated = [...workouts, workout];
    setWorkouts(updated);
    saveWorkoutsMutation.mutate(updated);
  };

  const updateWorkout = (id: string, workout: Partial<Workout>) => {
    const updated = workouts.map((w) => (w.id === id ? { ...w, ...workout } : w));
    setWorkouts(updated);
    saveWorkoutsMutation.mutate(updated);
  };

  const deleteWorkout = (id: string) => {
    const updated = workouts.filter((w) => w.id !== id);
    setWorkouts(updated);
    saveWorkoutsMutation.mutate(updated);
  };

  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updatedProfile };
    setProfile(newProfile);
    saveProfileMutation.mutate(newProfile);
  };

  const todayWorkouts = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return workouts.filter((w) => w.date === today);
  }, [workouts]);

  const totalVolume = useMemo(() => {
    return workouts.reduce((sum, workout) => sum + workout.totalVolume, 0);
  }, [workouts]);

  const totalWorkouts = workouts.length;

  const weeklyWorkouts = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workouts.filter((w) => {
      const workoutDate = new Date(w.date);
      return workoutDate >= sevenDaysAgo && workoutDate <= today;
    }).length;
  }, [workouts]);

  return {
    workouts,
    profile,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    updateProfile,
    todayWorkouts,
    totalVolume,
    totalWorkouts,
    weeklyWorkouts,
    isLoading: workoutsQuery.isLoading || profileQuery.isLoading,
  };
});

export function useWorkoutsByDate(date: string) {
  const { workouts } = useWorkouts();
  return useMemo(() => workouts.filter((w) => w.date === date), [workouts, date]);
}

export function useWorkoutStats() {
  const { workouts } = useWorkouts();
  
  return useMemo(() => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const recentWorkouts = workouts.filter((w) => {
      const workoutDate = new Date(w.date);
      return workoutDate >= last30Days;
    });

    const totalSets = recentWorkouts.reduce((sum, workout) => {
      return sum + workout.exercises.reduce((exerciseSum, exercise) => {
        return exerciseSum + exercise.sets.length;
      }, 0);
    }, 0);

    const totalReps = recentWorkouts.reduce((sum, workout) => {
      return sum + workout.exercises.reduce((exerciseSum, exercise) => {
        return exerciseSum + exercise.sets.reduce((setSum, set) => setSum + set.reps, 0);
      }, 0);
    }, 0);

    const totalDuration = recentWorkouts.reduce((sum, workout) => sum + workout.duration, 0);

    return {
      workoutsLast30Days: recentWorkouts.length,
      totalSets,
      totalReps,
      totalDuration,
      avgDuration: recentWorkouts.length > 0 ? totalDuration / recentWorkouts.length : 0,
    };
  }, [workouts]);
}
