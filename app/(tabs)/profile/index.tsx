import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert } from "react-native";
import { Stack } from "expo-router";
import { User, TrendingUp, Target, Settings, ChevronRight, Edit2 } from "lucide-react-native";
import { useState } from "react";

import Colors from "@/constants/colors";
import { useWorkouts } from "@/contexts/WorkoutContext";

export default function ProfileScreen() {
  const { profile, updateProfile, totalWorkouts, totalVolume } = useWorkouts();
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(profile.name);
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [weight, setWeight] = useState(profile.weight.toString());
  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [height, setHeight] = useState(profile.height.toString());

  const handleSaveName = () => {
    if (name.trim()) {
      updateProfile({ name: name.trim() });
      setIsEditingName(false);
    }
  };

  const handleSaveWeight = () => {
    const weightNum = parseFloat(weight);
    if (!isNaN(weightNum) && weightNum > 0) {
      updateProfile({ weight: weightNum });
      setIsEditingWeight(false);
    } else {
      Alert.alert("Invalid Weight", "Please enter a valid weight");
    }
  };

  const handleSaveHeight = () => {
    const heightNum = parseFloat(height);
    if (!isNaN(heightNum) && heightNum > 0) {
      updateProfile({ height: heightNum });
      setIsEditingHeight(false);
    } else {
      Alert.alert("Invalid Height", "Please enter a valid height");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Profile" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User color={Colors.light.card} size={40} />
          </View>
          <View style={styles.profileInfo}>
            {isEditingName ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  onBlur={handleSaveName}
                  onSubmitEditing={handleSaveName}
                />
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.nameContainer}
                onPress={() => setIsEditingName(true)}
              >
                <Text style={styles.profileName}>{profile.name}</Text>
                <Edit2 color={Colors.light.textSecondary} size={16} />
              </TouchableOpacity>
            )}
            <Text style={styles.profileGoal}>{profile.goal}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{totalWorkouts}</Text>
            <Text style={styles.statBoxLabel}>Workouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{Math.round(totalVolume / 1000)}k</Text>
            <Text style={styles.statBoxLabel}>Volume (kg)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Stats</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingIcon}>
              <TrendingUp color={Colors.light.primary} size={20} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Weight</Text>
              {isEditingWeight ? (
                <TextInput
                  style={styles.settingInput}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  autoFocus
                  onBlur={handleSaveWeight}
                  onSubmitEditing={handleSaveWeight}
                />
              ) : (
                <TouchableOpacity onPress={() => setIsEditingWeight(true)}>
                  <Text style={styles.settingValue}>{profile.weight} kg</Text>
                </TouchableOpacity>
              )}
            </View>
            <ChevronRight color={Colors.light.textSecondary} size={20} />
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingIcon}>
              <Target color={Colors.light.accent} size={20} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Height</Text>
              {isEditingHeight ? (
                <TextInput
                  style={styles.settingInput}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                  autoFocus
                  onBlur={handleSaveHeight}
                  onSubmitEditing={handleSaveHeight}
                />
              ) : (
                <TouchableOpacity onPress={() => setIsEditingHeight(true)}>
                  <Text style={styles.settingValue}>{profile.height} cm</Text>
                </TouchableOpacity>
              )}
            </View>
            <ChevronRight color={Colors.light.textSecondary} size={20} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingCard}>
            <View style={styles.settingIcon}>
              <Settings color={Colors.light.secondary} size={20} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Preferences</Text>
              <Text style={styles.settingDescription}>App settings and preferences</Text>
            </View>
            <ChevronRight color={Colors.light.textSecondary} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🎯 Your Fitness Goal</Text>
          <Text style={styles.infoText}>{profile.goal}</Text>
          <TouchableOpacity 
            style={styles.changeGoalButton}
            onPress={() => {
              const goals = ["Build muscle", "Lose weight", "Stay fit", "Improve strength"];
              const currentIndex = goals.indexOf(profile.goal);
              const nextGoal = goals[(currentIndex + 1) % goals.length];
              updateProfile({ goal: nextGoal });
            }}
          >
            <Text style={styles.changeGoalText}>Change Goal</Text>
          </TouchableOpacity>
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
  profileHeader: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    alignItems: "center" as const,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: "center" as const,
  },
  nameContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  profileGoal: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  editContainer: {
    width: 200,
  },
  input: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.light.text,
    textAlign: "center" as const,
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.primary,
    paddingVertical: 4,
  },
  statsContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-around" as const,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statBox: {
    alignItems: "center" as const,
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.light.border,
  },
  statBoxValue: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statBoxLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  settingCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.light.background,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  settingInput: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "600" as const,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primary,
    paddingVertical: 2,
  },
  infoCard: {
    backgroundColor: Colors.light.accent,
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.card,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: Colors.light.card,
    opacity: 0.9,
    marginBottom: 16,
  },
  changeGoalButton: {
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    padding: 12,
    alignItems: "center" as const,
  },
  changeGoalText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.light.accent,
  },
});
