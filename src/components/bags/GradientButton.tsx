import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

export default function GradientButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [{ opacity: disabled ? 0.45 : pressed ? 0.92 : 1 }]}
    >
      <LinearGradient
        colors={["#0891B2", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.btn}
      >
        <Text style={styles.text}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  text: { color: "#E2E8F0", fontWeight: "900", fontSize: 16 },
});
