import { ArrowLeft, Plus } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import EmptyPresets from "../components/items/EmptyPresets";
import PresetList from "../components/items/PresetList";
import { usePresets } from "../hooks/usePresets";

export default function ItemsStep({ onBack }: { onBack: () => void }) {
  const {
    presets,
    addPreset,
    removePreset,
    renamePreset,
    addItemToPreset,
    removeItemFromPreset,
  } = usePresets();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [autoEditId, setAutoEditId] = useState<string | null>(null);

  const handleAddPreset = () => {
    const id = addPreset(); // 🔥 tallentuu automaattisesti
    setExpandedId(id);
    setAutoEditId(id);
  };

  const handleRemovePreset = (id: string) => {
    removePreset(id);
    setExpandedId((prev) => (prev === id ? null : prev));
    setAutoEditId((prev) => (prev === id ? null : prev));
  };

  const togglePreset = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const consumeAutoEdit = (id: string) => {
    setAutoEditId((prev) => (prev === id ? null : prev));
  };

  return (
    <View style={{ gap: 14 }}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.backRow} hitSlop={10}>
          <ArrowLeft size={18} color="#E2E8F0" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Pressable onPress={handleAddPreset} style={styles.addBtn} hitSlop={10}>
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Preset</Text>
        </Pressable>
      </View>

      {presets.length === 0 ? (
        <EmptyPresets onAdd={handleAddPreset} />
      ) : (
        <PresetList
          presets={presets}
          expandedId={expandedId}
          autoEditId={autoEditId}
          onAdd={handleAddPreset}
          onToggle={togglePreset}
          onRemove={handleRemovePreset}
          onRename={renamePreset}
          onConsumeAutoEdit={consumeAutoEdit}
          onAddItem={addItemToPreset}
          onRemoveItem={removeItemFromPreset}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  backText: { color: "#E2E8F0", fontWeight: "900" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(37,99,235,0.18)",
    borderColor: "rgba(37,99,235,0.28)",
    borderWidth: 1,
  },
  addBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },
});