import { Trash2, ChevronDown, ChevronUp, Plus, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View, TextInput } from "react-native";
import { Text } from "react-native-paper";
import { AnimatePresence, MotiView } from "moti";

export type Preset = {
  id: string;
  name: string;
  items: string[];
};

export default function PresetCard({
  preset,
  expanded,
  autoEditName,
  onConsumeAutoEdit,
  onToggle,
  onRemove,
  onRename,
  onAddItem,
  onRemoveItem,
}: {
  preset: Preset;
  expanded: boolean;

  autoEditName?: boolean;
  onConsumeAutoEdit?: () => void;

  onToggle: () => void;
  onRemove: () => void;
  onRename: (name: string) => void;

  onAddItem: (text: string) => void;
  onRemoveItem: (index: number) => void;
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(preset.name);

  const [itemInput, setItemInput] = useState("");

  const nameInputRef = useRef<TextInput>(null);
  const itemInputRef = useRef<TextInput>(null);

  useEffect(() => {
    setDraftName(preset.name);
  }, [preset.name]);

  useEffect(() => {
    if (autoEditName) {
      setIsEditingName(true);
      if (!expanded) onToggle();
      onConsumeAutoEdit?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoEditName]);

  useEffect(() => {
    if (isEditingName) {
      setTimeout(() => nameInputRef.current?.focus(), 0);
    }
  }, [isEditingName]);

  const commitName = () => {
    const trimmed = draftName.trim();
    if (trimmed) onRename(trimmed);
    else setDraftName(preset.name);
    setIsEditingName(false);
  };

  const addItem = () => {
    const trimmed = itemInput.trim();
    if (!trimmed) return;

    onAddItem(trimmed);
    setItemInput("");
    setTimeout(() => itemInputRef.current?.focus(), 0);
  };

  return (
    <View style={styles.card}>
      {/* Header togglaa expand/collapse */}
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [styles.header, { opacity: pressed ? 0.92 : 1 }]}
      >
        <View style={styles.left}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>📦</Text>
          </View>

          <View style={{ flexShrink: 1 }}>
            {isEditingName ? (
              <TextInput
                ref={nameInputRef}
                value={draftName}
                onChangeText={setDraftName}
                onBlur={commitName}
                onSubmitEditing={commitName}
                returnKeyType="done"
                placeholder="Preset name"
                placeholderTextColor="#64748B"
                style={styles.nameInput}
                selectTextOnFocus
              />
            ) : (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
                hitSlop={6}
              >
                <Text style={styles.name} numberOfLines={1}>
                  {preset.name}
                </Text>
              </Pressable>
            )}

            <Text style={styles.meta}>
              {preset.items.length} items
              <Text style={styles.metaMuted}> · Tap name to rename</Text>
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <View style={styles.chev}>
            {expanded ? (
              <ChevronUp size={16} color="#94A3B8" />
            ) : (
              <ChevronDown size={16} color="#94A3B8" />
            )}
          </View>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            style={styles.trash}
            hitSlop={10}
          >
            <Trash2 size={16} color="#F87171" />
          </Pressable>
        </View>
      </Pressable>

      {/* ✅ Animated expand/collapse */}
      <AnimatePresence>
        {expanded && (
          <MotiView
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "timing", duration: 250 }}
            style={styles.expanded}
          >
            <Text style={styles.sectionLabel}>Items</Text>

            {/* Underline input row */}
            <View style={styles.addItemRow}>
              <TextInput
                ref={itemInputRef}
                value={itemInput}
                onChangeText={setItemInput}
                placeholder="Add item"
                placeholderTextColor="#64748B"
                style={styles.itemInputUnderline}
                onSubmitEditing={addItem}
                returnKeyType="done"
              />

              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  addItem();
                }}
                style={({ pressed }) => [styles.addIconBtn, { opacity: pressed ? 0.9 : 1 }]}
                hitSlop={6}
              >
                <Plus size={18} color="#E2E8F0" />
              </Pressable>
            </View>

            {preset.items.length === 0 ? (
              <Text style={styles.emptyText}>No items added yet.</Text>
            ) : (
              <View style={{ marginTop: 6 }}>
                {preset.items.map((it, idx) => (
                  <View
                    key={`${it}-${idx}`}
                    style={[styles.itemRow, idx === preset.items.length - 1 && styles.itemRowLast]}
                  >
                    <Text style={styles.itemText} numberOfLines={1}>
                      {it}
                    </Text>

                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        onRemoveItem(idx);
                      }}
                      style={styles.removeBtn}
                      hitSlop={6}
                    >
                      <X size={16} color="#F87171" />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    backgroundColor: "rgba(148,163,184,0.06)",
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12, flexShrink: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(34,211,238,0.35)",
    backgroundColor: "rgba(148,163,184,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 22 },

  name: { color: "#E2E8F0", fontWeight: "900" },
  nameInput: {
    minWidth: 160,
    paddingVertical: 0,
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 10,
    color: "#E2E8F0",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    backgroundColor: "rgba(148,163,184,0.06)",
    fontWeight: "900",
  },

  meta: { color: "#94A3B8", marginTop: 4, fontSize: 12 },
  metaMuted: { color: "#64748B" },

  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  chev: {
    width: 30,
    height: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(148,163,184,0.06)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
  },
  trash: { padding: 8, borderRadius: 12, backgroundColor: "rgba(248,113,113,0.10)" },

  expanded: {
    borderTopWidth: 1,
    borderTopColor: "rgba(148,163,184,0.12)",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
  },

  sectionLabel: { color: "#CBD5E1", fontWeight: "900", marginBottom: 8 },

  // Underline input row: viiva on osa riviä -> lähempänä sisältöä
  addItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.18)",
  },
  itemInputUnderline: {
    flex: 1,
    height: 36,
    color: "#E2E8F0",
    paddingHorizontal: 0,
    paddingVertical: 4,
  },

  addIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(37,99,235,0.18)",
    borderColor: "rgba(37,99,235,0.28)",
    borderWidth: 1,
  },

  emptyText: { color: "#94A3B8", fontSize: 12, marginTop: 10 },

  // Items: vain rivit + alleviivaus
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.12)",
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  itemText: {
    color: "#E2E8F0",
    fontSize: 14,
    flex: 1,
    paddingRight: 10,
  },
  removeBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "rgba(248,113,113,0.10)",
  },
});