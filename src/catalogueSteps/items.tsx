import React, { useMemo, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { ArrowLeft, Plus } from "lucide-react-native";

import EmptyPresets from "../components/items/EmptyPresets";
import PresetList from "../components/items/PresetList";
import { Preset } from "../components/items/PresetCard";

export default function ItemsStep({ onBack }: { onBack: () => void }) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [autoEditId, setAutoEditId] = useState<string | null>(null);

  const nextPresetNumber = useMemo(() => {
    const nums = presets
      .map((p) => {
        const m = p.name.match(/^Preset\s+(\d+)$/i);
        return m ? Number(m[1]) : null;
      })
      .filter((n): n is number => typeof n === "number" && !Number.isNaN(n));

    const max = nums.length ? Math.max(...nums) : 0;
    return max + 1;
  }, [presets]);

  const addPreset = () => {
    const id = String(Date.now());
    const newPreset: Preset = {
      id,
      name: `Preset ${nextPresetNumber}`,
      items: [],
    };

    setPresets((prev) => [newPreset, ...prev]);
    setExpandedId(id);
    setAutoEditId(id);
  };

  const removePreset = (id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
    setExpandedId((prev) => (prev === id ? null : prev));
    setAutoEditId((prev) => (prev === id ? null : prev));
  };

  const renamePreset = (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setPresets((prev) => prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p)));
  };

  const togglePreset = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const consumeAutoEdit = (id: string) => {
    setAutoEditId((prev) => (prev === id ? null : prev));
  };

  // ✅ Items handlers (logiikka täällä)
  const addItemToPreset = (presetId: string, item: string) => {
    const trimmed = item.trim();
    if (!trimmed) return;

    setPresets((prev) =>
      prev.map((p) =>
        p.id === presetId
          ? { ...p, items: [...p.items, trimmed] }
          : p
      )
    );
  };

  const removeItemFromPreset = (presetId: string, itemIndex: number) => {
    setPresets((prev) =>
      prev.map((p) =>
        p.id === presetId
          ? { ...p, items: p.items.filter((_, idx) => idx !== itemIndex) }
          : p
      )
    );
  };

  return (
    <View style={{ gap: 14 }}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.backRow} hitSlop={10}>
          <ArrowLeft size={18} color="#E2E8F0" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Pressable onPress={addPreset} style={styles.addBtn} hitSlop={10}>
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Preset</Text>
        </Pressable>
      </View>

      {presets.length === 0 ? (
        <EmptyPresets onAdd={addPreset} />
      ) : (
        <PresetList
          presets={presets}
          expandedId={expandedId}
          autoEditId={autoEditId}
          onAdd={addPreset}
          onToggle={togglePreset}
          onRemove={removePreset}
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