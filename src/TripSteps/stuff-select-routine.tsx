import React from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { MotiView } from "moti";
import { Plus, Trash2 } from "lucide-react-native";

export default function StuffSelectRoutineStep({
  items,
  onItemsChange,
  newItemName,
  onNewItemNameChange,
}: any) {
  const addItem = () => {
    if (!newItemName.trim()) return;
    onItemsChange([
      ...items,
      { id: String(Date.now()), name: newItemName.trim(), checked: false },
    ]);
    onNewItemNameChange("");
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter((i: any) => i.id !== id));
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: 18 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 220 }}
      style={{ gap: 18 }}
    >
      <View>
        <Text style={styles.label}>Add Item</Text>
        <View style={styles.row}>
          <TextInput
            mode="outlined"
            value={newItemName}
            onChangeText={onNewItemNameChange}
            placeholder="Item name"
            style={[styles.input, { flex: 1 }]}
            outlineColor="rgba(148,163,184,0.25)"
            activeOutlineColor="#22D3EE"
            textColor="#E2E8F0"
            placeholderTextColor="#64748B"
            theme={{ roundness: 14 }}
          />
          <Pressable onPress={addItem} style={styles.addBtn}>
            <Plus size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={{ color: "#E2E8F0" }}>{item.name}</Text>
            <Pressable onPress={() => removeItem(item.id)}>
              <Trash2 size={18} color="#F87171" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#94A3B8", textAlign: "center", marginTop: 20 }}>
            No items added yet.
          </Text>
        }
      />
    </MotiView>
  );
}

const styles = StyleSheet.create({
  label: { color: "#CBD5E1", marginBottom: 8 },
  row: { flexDirection: "row", gap: 10, alignItems: "center" },
  input: { backgroundColor: "rgba(148,163,184,0.06)" },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22D3EE",
  },
  itemRow: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(148,163,184,0.08)",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
