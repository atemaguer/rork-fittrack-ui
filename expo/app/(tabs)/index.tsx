import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Plus, Dumbbell, Flame, Clock } from "lucide-react-native";
import { format } from "date-fns";

import Colors from "@/constants/colors";
import { useWorkouts } from "@/contexts/WorkoutContext";
import { WORKOUT_TEMPLATES } from "@/mocks/exercises";

export default function HomeScreen() {
  const router = useRouter();
  const { todayWorkouts, weeklyWorkouts, profile, isLoading } = useWorkouts();
  const today = format(new Date(), "EEEE, MMMM d");

  const todayCompleted = todayWorkouts.filter((w) => w.completed).length;
  const todayTotal = todayWorkouts.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "FitTrack" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {profile.name}!</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.primaryStatCard]}>
            <View style={styles.statIconContainer}>
              <Flame color={Colors.light.card} size={24} />
            </View>
            <Text style={styles.statValue}>{weeklyWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts this week</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.secondaryIcon]}>
              <Clock color={Colors.light.primary} size={20} />
            </View>
            <Text style={styles.statValueSmall}>{todayCompleted}/{todayTotal}</Text>
            <Text style={styles.statLabelSmall}>Today</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <Text style={styles.sectionSubtitle}>Choose a workout template</Text>
          
          <View style={styles.templateGrid}>
            {WORKOUT_TEMPLATES.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={styles.templateCard}
                onPress={() => {
                  console.log('Starting workout:', template.name);
                }}
              >
                <View style={styles.templateIcon}>
                  <Dumbbell color={Colors.light.primary} size={24} />
                </View>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateExercises}>
                  {template.exercises.length} exercises
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.customButton}>
          <Plus color={Colors.light.card} size={24} />
          <Text style={styles.customButtonText}>Create Custom Workout</Text>
        </TouchableOpacity>

        {todayWorkouts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Workouts</Text>
            {todayWorkouts.map((workout) => (
              <View key={workout.id} style={styles.workoutCard}>
                <View style={styles.workoutHeader}>
                  <Text style={styles.workoutTitle}>{workout.title}</Text>
                  {workout.completed && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>✓ Done</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.workoutDetails}>
                  {workout.exercises.length} exercises • {workout.duration} min
                </Text>
              </View>
            ))}
          </View>
        )}
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
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  statsContainer: {
    flexDirection: "row" as const,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryStatCard: {
    backgroundColor: Colors.light.primary,
    flex: 1.5,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 12,
  },
  secondaryIcon: {
    backgroundColor: Colors.light.background,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.light.card,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.card,
    opacity: 0.9,
  },
  statValueSmall: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabelSmall: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  templateGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
  },
  templateCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  templateIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 12,
  },
  templateName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  templateExercises: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  customButton: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    padding: 18,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    marginBottom: 32,
  },
  customButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.card,
  },
  workoutCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  workoutHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
  },
  completedBadge: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.light.card,
  },
  workoutDetails: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
