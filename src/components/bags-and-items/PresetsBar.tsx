import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { Plus } from "lucide-react-native";
import type { Preset } from "../../../app/create-trip";

export default function PresetsBar({
  itemPresets,
  disabled,
  hint,
  onPressPreset,
}: {
  itemPresets: Preset[];
  disabled: boolean;
  hint: string;
  onPressPreset: (preset: Preset) => void;
}) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>Quick Add Presets</Text>
      <Text style={styles.hint}>{hint}</Text>

      <View style={styles.presetWrap}>
        {itemPresets.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => onPressPreset(p)}
            disabled={disabled}
            style={({ pressed }) => [
              styles.presetChip,
              { opacity: disabled ? 0.45 : pressed ? 0.9 : 1 },
            ]}
          >
            <Plus size={14} color="#E2E8F0" />
            <Text style={styles.presetText}>{p.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 14 },
  label: { color: "#CBD5E1", marginBottom: 8 },
  hint: { color: "#94A3B8", fontSize: 12, marginBottom: 10 },

  presetWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  presetChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(37,99,235,0.18)",
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.28)",
  },
  presetText: { color: "#E2E8F0", fontSize: 13, fontWeight: "800" },
});
