import React from "react";
import { Pressable, StyleSheet, Text as RNText } from "react-native";
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
      style={({ pressed }) => [
        styles.pressable,
        { opacity: disabled ? 0.45 : pressed ? 0.9 : 1 },
      ]}
    >
      <LinearGradient colors={["#0891B2", "#2563EB"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
        <RNText style={styles.text}>{label}</RNText>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { width: "100%", alignSelf: "stretch" },
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
  text: { color: "#E2E8F0", fontWeight: "700", fontSize: 16 },
});
