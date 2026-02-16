import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { MotiView } from "moti";
import { Dumbbell, Briefcase, Book, Star } from "lucide-react-native";

const routineOptions = [
  { key: "gym", label: "Gym", icon: Dumbbell },
  { key: "hobby", label: "Hobby", icon: Star },
  { key: "workbag", label: "Work Bag", icon: Briefcase },
  { key: "schoolbag", label: "School Bag", icon: Book },
];

export default function TripNameRoutineStep({
  routineName,
  onRoutineNameChange,
  routineKinds,
  onRoutineKindsChange,
}: any) {
  const toggleKind = (k: string) => {
    if (routineKinds.includes(k)) {
      onRoutineKindsChange(routineKinds.filter((x: string) => x !== k));
    } else {
      onRoutineKindsChange([...routineKinds, k]);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: 18 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 220 }}
      style={{ gap: 18 }}
    >
      <View>
        <Text style={styles.label}>Routine Name</Text>
        <TextInput
          mode="outlined"
          value={routineName}
          onChangeText={onRoutineNameChange}
          placeholder="e.g., Gym Bag"
          outlineColor="rgba(148,163,184,0.25)"
          activeOutlineColor="#22D3EE"
          style={styles.input}
          textColor="#E2E8F0"
          placeholderTextColor="#64748B"
          theme={{ roundness: 14 }}
        />
      </View>

      <View>
        <Text style={styles.label}>Routine Type</Text>
        <View style={styles.grid}>
          {routineOptions.map((opt) => {
            const selected = routineKinds.includes(opt.key);
            const Icon = opt.icon;

            return (
              <Pressable
                key={opt.key}
                onPress={() => toggleKind(opt.key)}
                style={[
                  styles.typeCard,
                  {
                    borderColor: selected ? "#22D3EE" : "rgba(148,163,184,0.25)",
                    backgroundColor: selected
                      ? "rgba(34,211,238,0.15)"
                      : "rgba(148,163,184,0.08)",
                  },
                ]}
              >
                <Icon size={22} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.typeText}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  label: { color: "#CBD5E1", marginBottom: 8 },
  input: { backgroundColor: "rgba(148,163,184,0.06)" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeCard: {
    width: "48%",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    gap: 8,
  },
  typeText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
  },
});
