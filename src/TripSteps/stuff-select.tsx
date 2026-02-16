import { Plus, Trash2 } from "lucide-react-native";
import { MotiView } from "moti";
import React from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Chip, Text, TextInput } from "react-native-paper";
import type { Item, Preset } from "../../app/create-trip";

export default function StuffSelectStep({
  itemPresets,
  items,
  onItemsChange,
  newItemName,
  onNewItemNameChange,
}: {
  itemPresets: Preset[];
  items: Item[];
  onItemsChange: (items: Item[]) => void;
  newItemName: string;
  onNewItemNameChange: (v: string) => void;
}) {
  const addItem = () => {
    const name = newItemName.trim();
    if (!name) return;
    onItemsChange([...items, { id: String(Date.now()), name, checked: false }]);
    onNewItemNameChange("");
  };

  const addPreset = (preset: Preset) => {
    const newItems: Item[] = preset.items.map((n) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: n,
      checked: false,
    }));
    onItemsChange([...items, ...newItems]);
  };

  const removeItem = (id: string) => onItemsChange(items.filter((i) => i.id !== id));

  return (
    <MotiView from={{ opacity: 0, translateX: 18 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: "timing", duration: 220 }}>
      <View style={styles.block}>
        <Text style={styles.label}>Quick Add Presets</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {itemPresets.map((p) => (
            <Chip
              key={p.id}
              onPress={() => addPreset(p)}
              style={{
                backgroundColor: "rgba(37,99,235,0.18)",
                borderColor: "rgba(37,99,235,0.25)",
                borderWidth: 1,
              }}
              textStyle={{ color: "#E2E8F0" }}
              icon={() => <Plus size={14} color="#E2E8F0" />}
            >
              {p.name}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Add Custom Item</Text>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <TextInput
            mode="outlined"
            value={newItemName}
            onChangeText={onNewItemNameChange}
            placeholder="Item name"
            outlineColor="rgba(148,163,184,0.25)"
            activeOutlineColor="#22D3EE"
            style={[styles.input, { flex: 1 }]}
            textColor="#E2E8F0"
            placeholderTextColor="#64748B"
            theme={{ roundness: 14 }}
            onSubmitEditing={addItem}
            returnKeyType="done"
          />
          <Pressable onPress={addItem} style={styles.addBtn} hitSlop={6}>
            <Plus size={20} color="#E2E8F0" />
          </Pressable>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={{ color: "#CBD5E1", marginBottom: 10 }}>Items ({items.length})</Text>

        <View style={{ maxHeight: 260 }}>
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text style={{ color: "#E2E8F0" }}>{item.name}</Text>
                <Pressable onPress={() => removeItem(item.id)} style={styles.trashBtn} hitSlop={6}>
                  <Trash2 size={16} color="#F87171" />
                </Pressable>
              </View>
            )}
            ListEmptyComponent={
              <View style={{ paddingVertical: 28, alignItems: "center" }}>
                <Text style={{ color: "#94A3B8", textAlign: "center" }}>
                  No items added yet. Add items manually or use presets above.
                </Text>
              </View>
            }
            scrollEnabled={false}
          />
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 14 },
  label: { color: "#CBD5E1", marginBottom: 8 },
  input: { backgroundColor: "rgba(148,163,184,0.06)" },

  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0891B2",
  },

  itemRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(148,163,184,0.06)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  trashBtn: { padding: 6, borderRadius: 10, backgroundColor: "rgba(248,113,113,0.10)" },
});
