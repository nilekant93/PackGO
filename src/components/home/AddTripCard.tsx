import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";

export default function AddTripCard({
  width,
  onPress,
}: {
  width: number;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.card, { width }]} android_ripple={{ color: "rgba(34,211,238,0.16)" }}>
      <LinearGradient
        colors={["rgba(34, 211, 238, 0)", "rgba(148, 163, 184, 0)", "rgba(148,163,184,0.08)"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <Plus size={32} color="#ededed" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 176,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.28)",
    backgroundColor: "rgba(148, 163, 184, 0)",
    padding: 16,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  iconWrap: {
    width: 66,
    height: 66,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22D3EE",
  },

  title: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "900",
  },
  sub: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: -2,
  },

  footer: {
    marginTop: "auto",
    paddingTop: 10,
  },
  hint: { color: "#22D3EE", fontWeight: "800", fontSize: 12, textAlign: "center" },
});