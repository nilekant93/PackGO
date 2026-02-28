import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { Box, Plus, Sparkles } from "lucide-react-native";
import { useRouter } from "expo-router";
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
  const router = useRouter();
  const hasPresets = itemPresets.length > 0;

  return (
    <View style={styles.block}>
      {/* Title */}
      <Text style={styles.label}>Quick Add Presets</Text>

      {/* ✅ CTA under title, left aligned */}
      {!hasPresets && (
        <Pressable
          onPress={() =>
            router.push({ pathname: "/your-stuff", params: { step: "items" } })
          }
          style={({ pressed }) => [
            styles.createChip,
            { opacity: pressed ? 0.9 : 1 },
          ]}
          hitSlop={10}
        >
          <Box size={14} color="#E2E8F0" />
          <Text style={styles.createText}>Create presets</Text>
        </Pressable>
      )}

      {/* Hint */}
      <Text style={styles.hint}>{hint}</Text>

      {/* Preset chips */}
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

      {!hasPresets && (
        <Text style={styles.emptyHint}>
          No presets yet — create some in{" "}
          <Text style={styles.emptyHintStrong}>Your Stuff</Text>.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 14 },

  label: { color: "#CBD5E1", marginBottom: 8 },

  createChip: {
    alignSelf: "flex-start", // 👈 vasemmalle
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(34,211,238,0.10)",
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.25)",
    marginBottom: 10,
  },
  createText: { color: "#E2E8F0", fontSize: 12, fontWeight: "900" },

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

  emptyHint: { color: "#94A3B8", fontSize: 12, marginTop: 10 },
  emptyHintStrong: { color: "#CBD5E1", fontWeight: "900" },
});