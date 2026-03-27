import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Stack } from "expo-router";
import { Calendar, Dumbbell, Clock } from "lucide-react-native";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { useState, useMemo } from "react";

import Colors from "@/constants/colors";
import { useWorkouts } from "@/contexts/WorkoutContext";

export default function HistoryScreen() {
  const { workouts } = useWorkouts();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const currentMonth = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: currentMonth, end: monthEnd });

  const workoutsByDate = useMemo(() => {
    const map = new Map<string, typeof workouts>();
    workouts.forEach((workout) => {
      const dateKey = workout.date;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)?.push(workout);
    });
    return map;
  }, [workouts]);

  const selectedWorkouts = useMemo(() => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return workoutsByDate.get(dateKey) || [];
  }, [workoutsByDate, selectedDate]);

  const hasWorkout = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return workoutsByDate.has(dateKey);
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Workout History" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthButton}>
              <Text style={styles.monthButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{format(selectedDate, "MMMM yyyy")}</Text>
            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthButton}>
              <Text style={styles.monthButtonText}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text key={day} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendar}>
            {daysInMonth.map((day, index) => {
              const isSelected = isSameDay(day, selectedDate);
              const hasWorkouts = hasWorkout(day);
              const dayOfWeek = day.getDay();
              const isFirstWeek = index < 7;
              const offset = isFirstWeek && index === 0 ? dayOfWeek : 0;

              return (
                <View key={day.toISOString()} style={[styles.dayWrapper, { marginLeft: offset * 14.28 + '%' }]}>
                  <TouchableOpacity
                    style={[
                      styles.day,
                      isSelected && styles.selectedDay,
                      hasWorkouts && !isSelected && styles.dayWithWorkout,
                    ]}
                    onPress={() => setSelectedDate(day)}
                  >
                    <Text style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                      hasWorkouts && !isSelected && styles.dayWithWorkoutText,
                    ]}>
                      {format(day, "d")}
                    </Text>
                    {hasWorkouts && !isSelected && <View style={styles.workoutDot} />}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.selectedDateSection}>
          <Text style={styles.selectedDateTitle}>
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </Text>
          
          {selectedWorkouts.length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar color={Colors.light.textSecondary} size={48} />
              <Text style={styles.emptyStateText}>No workouts on this day</Text>
            </View>
          ) : (
            <View style={styles.workoutsList}>
              {selectedWorkouts.map((workout) => (
                <View key={workout.id} style={styles.workoutCard}>
                  <View style={styles.workoutHeader}>
                    <View style={styles.workoutIconContainer}>
                      <Dumbbell color={Colors.light.primary} size={20} />
                    </View>
                    <View style={styles.workoutInfo}>
                      <Text style={styles.workoutTitle}>{workout.title}</Text>
                      <View style={styles.workoutMeta}>
                        <Clock color={Colors.light.textSecondary} size={14} />
                        <Text style={styles.workoutMetaText}>{workout.duration} min</Text>
                        <Text style={styles.workoutMetaText}>•</Text>
                        <Text style={styles.workoutMetaText}>{workout.exercises.length} exercises</Text>
                      </View>
                    </View>
                    {workout.completed && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>✓</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.volumeContainer}>
                    <Text style={styles.volumeLabel}>Total Volume</Text>
                    <Text style={styles.volumeValue}>{workout.totalVolume} kg</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>This Month</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{workouts.filter(w => {
                const workoutDate = parseISO(w.date);
                return workoutDate >= currentMonth && workoutDate <= monthEnd;
              }).length}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(
                workouts.filter(w => {
                  const workoutDate = parseISO(w.date);
                  return workoutDate >= currentMonth && workoutDate <= monthEnd;
                }).reduce((sum, w) => sum + w.duration, 0) / 60
              )}h</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  calendarContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  monthButton: {
    padding: 8,
  },
  monthButtonText: {
    fontSize: 24,
    color: Colors.light.primary,
    fontWeight: "600" as const,
  },
  weekDays: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    marginBottom: 12,
  },
  weekDay: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.textSecondary,
    width: "14.28%",
    textAlign: "center" as const,
  },
  calendar: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
  },
  dayWrapper: {
    width: "14.28%",
    aspectRatio: 1,
    padding: 2,
  },
  day: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRadius: 8,
    position: "relative" as const,
  },
  selectedDay: {
    backgroundColor: Colors.light.primary,
  },
  dayWithWorkout: {
    backgroundColor: Colors.light.background,
  },
  dayText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500" as const,
  },
  selectedDayText: {
    color: Colors.light.card,
    fontWeight: "700" as const,
  },
  dayWithWorkoutText: {
    color: Colors.light.primary,
    fontWeight: "600" as const,
  },
  workoutDot: {
    position: "absolute" as const,
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.primary,
  },
  selectedDateSection: {
    marginBottom: 24,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 40,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: 16,
  },
  workoutsList: {
    gap: 12,
  },
  workoutCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  workoutHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  workoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.light.background,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  workoutMeta: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
  },
  workoutMetaText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.success,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  completedText: {
    fontSize: 16,
    color: Colors.light.card,
    fontWeight: "700" as const,
  },
  volumeContainer: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  volumeLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  volumeValue: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.primary,
  },
  statsSection: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row" as const,
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center" as const,
    padding: 16,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
});
