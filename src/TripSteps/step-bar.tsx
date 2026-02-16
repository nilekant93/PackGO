import React from "react";
import { View, StyleSheet } from "react-native";

export default function StepBar({ index, count }: { index: number; count: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.seg,
            { backgroundColor: i === index ? "#22D3EE" : "rgba(148,163,184,0.25)" },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, marginBottom: 0 },
  seg: { flex: 1, height: 4, borderRadius: 999 },
});
