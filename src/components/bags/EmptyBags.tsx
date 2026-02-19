import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import GradientButton from "./GradientButton";

export default function EmptyBags({ onAdd }: { onAdd: () => void }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>You don’t have any bags yet</Text>
      <Text style={styles.sub}>Add your first bag to start organizing your trips.</Text>

      <View style={{ marginTop: 14, width: "100%" }}>
        <GradientButton label="Add your first bag" onPress={onAdd} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(148,163,184,0.25)",
    backgroundColor: "rgba(148,163,184,0.06)",
    padding: 16,
    alignItems: "center",
  },
  title: { color: "#E2E8F0", fontWeight: "900", fontSize: 16, textAlign: "center" },
  sub: { color: "#94A3B8", marginTop: 6, fontSize: 12, textAlign: "center" },
});
