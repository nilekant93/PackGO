import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
import GradientButton from "./GradientButton";

export default function AddItemPanel({
  label,
  value,
  onChangeText,
  disabled,
  onAdd,
  addDisabled,
  showTip,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  disabled: boolean;
  onAdd: () => void;
  addDisabled: boolean;
  showTip: boolean;
}) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        placeholder={disabled ? "Add a bag first..." : "Item name"}
        disabled={disabled}
        outlineColor="rgba(148,163,184,0.25)"
        activeOutlineColor="#22D3EE"
        style={styles.input}
        textColor="#E2E8F0"
        placeholderTextColor="#64748B"
        theme={{ roundness: 14 }}
        onSubmitEditing={onAdd}
        returnKeyType="done"
      />

      <View style={{ marginTop: 12 }}>
        <GradientButton label="Add Item" onPress={onAdd} disabled={addDisabled} />
      </View>

      {showTip && (
        <Text style={[styles.hint, { marginTop: 10 }]}>
          Tip: tap a bag to make it active. Otherwise you’ll be asked which bag to use.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 14 },
  label: { color: "#CBD5E1", marginBottom: 8 },
  hint: { color: "#94A3B8", fontSize: 12 },
  input: { backgroundColor: "rgba(148,163,184,0.06)" },
});
