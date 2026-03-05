import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native-paper";

export default function PackingHeaderCard({
  total,
  checked,
  onStartPacking,
}: {
  total: number;
  checked: number;
  onStartPacking: () => void;
}) {
  const progress = total === 0 ? 0 : Math.round((checked / total) * 100);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>Packing progress</Text>
          <Text style={styles.sub}>
            Packed {checked}/{total}
          </Text>
        </View>

        <Text style={styles.percent}>{progress}%</Text>
      </View>

      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>

      <Pressable onPress={onStartPacking} style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }, styles.btnWrap]}>
        <LinearGradient
          colors={["#0891B2", "#2563EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>Start packing</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "rgb(11, 26, 48)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    marginBottom: 18,
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: "#E2E8F0", fontWeight: "900" },
  sub: { color: "#94A3B8", marginTop: 4, fontSize: 12 },
  percent: { color: "#22D3EE", fontWeight: "900", fontSize: 16 },

  bar: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(148,163,184,0.18)",
    marginTop: 12,
  },
  fill: {
    height: "100%",
    backgroundColor: "#22D3EE",
  },

  btnWrap: { marginTop: 14 },
  btn: {
    minHeight: 52,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "#E2E8F0", fontWeight: "900", fontSize: 16 },
});