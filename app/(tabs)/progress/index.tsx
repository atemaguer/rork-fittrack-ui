import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { Stack } from "expo-router";
import { TrendingUp, Award, Target, Flame } from "lucide-react-native";
import { format, subDays } from "date-fns";
import { useMemo } from "react";

import Colors from "@/constants/colors";
import { useWorkouts, useWorkoutStats } from "@/contexts/WorkoutContext";

export default function ProgressScreen() {
  const { workouts, totalVolume, totalWorkouts } = useWorkouts();
  const stats = useWorkoutStats();

  const last7DaysData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, "yyyy-MM-dd");
      const dayWorkouts = workouts.filter((w) => w.date === dateStr);
      const totalDuration = dayWorkouts.reduce((sum, w) => sum + w.duration, 0);
      const totalVol = dayWorkouts.reduce((sum, w) => sum + w.totalVolume, 0);
      
      return {
        day: format(date, "EEE"),
        duration: totalDuration,
        volume: totalVol,
      };
    });

    const maxDuration = Math.max(...last7Days.map(d => d.duration), 1);
    const maxVolume = Math.max(...last7Days.map(d => d.volume), 1);

    return last7Days.map(d => ({
      ...d,
      durationPercent: (d.duration / maxDuration) * 100,
      volumePercent: (d.volume / maxVolume) * 100,
    }));
  }, [workouts]);

  const avgWorkoutDuration = totalWorkouts > 0 
    ? Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / totalWorkouts) 
    : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Progress" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Track your fitness journey</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.light.primary + "20" }]}>
              <Flame color={Colors.light.primary} size={24} />
            </View>
            <Text style={styles.statValue}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.light.accent + "20" }]}>
              <Target color={Colors.light.accent} size={24} />
            </View>
            <Text style={styles.statValue}>{Math.round(totalVolume / 1000)}k</Text>
            <Text style={styles.statLabel}>Total Volume (kg)</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.light.secondary + "20" }]}>
              <Award color={Colors.light.secondary} size={24} />
            </View>
            <Text style={styles.statValue}>{avgWorkoutDuration}</Text>
            <Text style={styles.statLabel}>Avg Duration (min)</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.light.warning + "20" }]}>
              <TrendingUp color={Colors.light.warning} size={24} />
            </View>
            <Text style={styles.statValue}>{stats.workoutsLast30Days}</Text>
            <Text style={styles.statLabel}>Last 30 Days</Text>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weekly Activity (Minutes)</Text>
          <Text style={styles.chartSubtitle}>Last 7 days</Text>
          <View style={styles.barChart}>
            {last7DaysData.map((day, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barColumn}>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.barFill,
                        { 
                          height: `${day.durationPercent}%`,
                          backgroundColor: Colors.light.primary,
                        }
                      ]} 
                    />
                  </View>
                  {day.duration > 0 && (
                    <Text style={styles.barValue}>{day.duration}</Text>
                  )}
                </View>
                <Text style={styles.barLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Volume Lifted (kg)</Text>
          <Text style={styles.chartSubtitle}>Last 7 days</Text>
          <View style={styles.barChart}>
            {last7DaysData.map((day, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barColumn}>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.barFill,
                        { 
                          height: `${day.volumePercent}%`,
                          backgroundColor: Colors.light.accent,
                        }
                      ]} 
                    />
                  </View>
                  {day.volume > 0 && (
                    <Text style={styles.barValue}>{Math.round(day.volume)}</Text>
                  )}
                </View>
                <Text style={styles.barLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.achievementCard}>
          <View style={styles.achievementIcon}>
            <Award color={Colors.light.primary} size={32} />
          </View>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>Keep it up!</Text>
            <Text style={styles.achievementText}>
              You've completed {stats.workoutsLast30Days} workouts in the last 30 days
            </Text>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  statsGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  chartCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  achievementCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 16,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.card,
    marginBottom: 4,
  },
  achievementText: {
    fontSize: 14,
    color: Colors.light.card,
    opacity: 0.9,
  },
  barChart: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    alignItems: "flex-end" as const,
    height: 200,
    paddingTop: 20,
  },
  barContainer: {
    flex: 1,
    alignItems: "center" as const,
    gap: 8,
  },
  barColumn: {
    flex: 1,
    width: "100%",
    alignItems: "center" as const,
    justifyContent: "flex-end" as const,
  },
  barBackground: {
    width: 30,
    height: 150,
    backgroundColor: Colors.light.background,
    borderRadius: 6,
    overflow: "hidden" as const,
    justifyContent: "flex-end" as const,
  },
  barFill: {
    width: "100%",
    borderRadius: 6,
    minHeight: 2,
  },
  barValue: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginTop: 4,
  },
  barLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
  },
});
