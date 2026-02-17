import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { Trash2, ChevronDown, ChevronRight, X } from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import type { BagWithItems } from "../../TripSteps/bags-and-items";

export default function BagCard({
  bag,
  isActive,
  onToggleExpand,
  onMakeActive,
  onRemoveBag,
  onRemoveItem,
}: {
  bag: BagWithItems;
  isActive: boolean;
  onToggleExpand: () => void;
  onMakeActive: () => void;
  onRemoveBag: () => void;
  onRemoveItem: (itemId: string) => void;
}) {
  return (
    <View
      style={[
        styles.bagCard,
        isActive && {
          borderColor: "#22D3EE",
          backgroundColor: "rgba(34,211,238,0.10)",
        },
      ]}
    >
      <Pressable
        onPress={() => {
          onMakeActive();
          onToggleExpand();
        }}
        style={styles.bagHeaderRow}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 20 }}>💼</Text>
          <View>
            <Text style={styles.bagName}>{bag.name}</Text>
            <Text style={styles.bagMeta}>
              {bag.type} • {bag.items.length} items
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onRemoveBag();
            }}
            style={styles.trashMini}
            hitSlop={10}
          >
            <Trash2 size={16} color="#F87171" />
          </Pressable>

          {bag.isExpanded ? (
            <ChevronDown size={20} color="#E2E8F0" />
          ) : (
            <ChevronRight size={20} color="#E2E8F0" />
          )}
        </View>
      </Pressable>

      <AnimatePresence>
        {bag.isExpanded && (
          <MotiView
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "timing", duration: 220 }}
            style={styles.bagBody}
          >
            {bag.items.length === 0 ? (
              <View style={styles.bagEmpty}>
                <Text style={styles.bagEmptyText}>
                  Add presets above or add items using the input.
                </Text>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {bag.items.map((it) => (
                  <View key={it.id} style={styles.itemRow}>
                    <Text style={{ color: "#E2E8F0" }}>{it.name}</Text>
                    <Pressable onPress={() => onRemoveItem(it.id)} style={styles.trashBtn} hitSlop={6}>
                      <X size={14} color="#F87171" />
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
  bagCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(148,163,184,0.25)",
    backgroundColor: "rgba(148,163,184,0.06)",
    overflow: "hidden",
  },
  bagHeaderRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bagName: { color: "#E2E8F0", fontWeight: "900" },
  bagMeta: { color: "#94A3B8", marginTop: 2, fontSize: 12 },

  trashMini: { padding: 6, borderRadius: 10, backgroundColor: "rgba(248,113,113,0.12)" },

  bagBody: { paddingHorizontal: 14, paddingBottom: 14 },
  bagEmpty: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(148,163,184,0.22)",
    backgroundColor: "rgba(148,163,184,0.04)",
    alignItems: "center",
  },
  bagEmptyText: { color: "#94A3B8", fontSize: 12 },

  itemRow: {
    paddingVertical: 10,
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
