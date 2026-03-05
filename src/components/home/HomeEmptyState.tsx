import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeEmptyState() {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={["rgba(34,211,238,0.14)", "rgba(148,163,184,0.06)"]}
        style={StyleSheet.absoluteFillObject}
      />
      <Text style={styles.title}>No trips yet</Text>
      <Text style={styles.sub}>
        Go to “Create Trip” to add your first trip. It will appear here in the carousel.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    backgroundColor: "rgba(148,163,184,0.08)",
    overflow: "hidden",
  },
  title: { color: "#E2E8F0", fontWeight: "900", fontSize: 14 },
  sub: { color: "#94A3B8", marginTop: 6, fontSize: 12, lineHeight: 16 },
});