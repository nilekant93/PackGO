import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { ArrowLeft } from "lucide-react-native";

export default function ItemsStep({ onBack }: { onBack: () => void }) {
  return (
    <View style={{ gap: 14 }}>
      <Pressable onPress={onBack} style={styles.backRow} hitSlop={10}>
        <ArrowLeft size={18} color="#E2E8F0" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.panel}>
        <Text style={styles.title}>Items</Text>
        <Text style={styles.subtitle}>Here you will add/remove items and presets later.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  backText: { color: "#E2E8F0", fontWeight: "900" },

  panel: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    backgroundColor: "rgba(148,163,184,0.06)",
    padding: 16,
  },
  title: { color: "#E2E8F0", fontWeight: "900", fontSize: 16 },
  subtitle: { color: "#94A3B8", marginTop: 6, fontSize: 12 },
});
