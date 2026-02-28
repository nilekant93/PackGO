import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { Text } from "react-native-paper";
import { Trash2, ChevronDown, ChevronRight, X, Pencil, GripVertical } from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";

import type { BagWithItems } from "../../TripSteps/bags-and-items";
import type { Item } from "../../../app/create-trip";
import { getBagImageSrc } from "../bags/types";

export default function BagCard({
  bag,
  isActive,
  onToggleExpand,
  onMakeActive,
  onRemoveBag,
  onRemoveItem,
  onEdit,
  onReorderItems,
}: {
  bag: BagWithItems;
  isActive: boolean;
  onToggleExpand: () => void;
  onMakeActive: () => void;
  onRemoveBag: () => void;
  onRemoveItem: (itemId: string) => void;
  onEdit: () => void;
  onReorderItems: (nextItems: Item[]) => void;
}) {
  const renderItem = ({ item, drag, isActive: dragging }: RenderItemParams<Item>) => {
    return (
      <View style={[styles.itemRow, dragging && styles.itemRowDragging]}>
        <Pressable onLongPress={drag} hitSlop={10} style={styles.dragHandle}>
          <GripVertical size={16} color="#94A3B8" />
        </Pressable>

        <Text style={styles.itemText} numberOfLines={1}>
          {item.name}
        </Text>

        <Pressable onPress={() => onRemoveItem(item.id)} style={styles.trashBtn} hitSlop={6}>
          <X size={14} color="#F87171" />
        </Pressable>
      </View>
    );
  };

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
        <View style={styles.leftRow}>
          <View style={styles.circle}>
            <Image source={getBagImageSrc(bag.imageId)} style={styles.circleImg} resizeMode="cover" />
          </View>

          <View style={{ flexShrink: 1 }}>
            <Text style={styles.bagName} numberOfLines={1}>
              {bag.name}
            </Text>
            <Text style={styles.bagMeta} numberOfLines={1}>
              {bag.type} • {bag.items.length} items
            </Text>
          </View>
        </View>

        <View style={styles.rightRow}>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            style={styles.iconMini}
            hitSlop={10}
          >
            <Pencil size={16} color="#E2E8F0" />
          </Pressable>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onRemoveBag();
            }}
            style={[styles.iconMini, styles.trashMini]}
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
                <Text style={styles.bagEmptyText}>Add presets above or add items using the input.</Text>
              </View>
            ) : (
              <DraggableFlatList
                data={bag.items}
                keyExtractor={(it) => it.id}
                onDragBegin={() => onMakeActive()}
                onDragEnd={({ data }) => onReorderItems(data)}
                renderItem={renderItem}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              />
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

  leftRow: { flexDirection: "row", alignItems: "center", gap: 10, flexShrink: 1 },
  rightRow: { flexDirection: "row", alignItems: "center", gap: 10 },

  circle: {
    width: 38,
    height: 38,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(148,163,184,0.06)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
  },
  circleImg: { width: "100%", height: "100%" },

  bagName: { color: "#E2E8F0", fontWeight: "900" },
  bagMeta: { color: "#94A3B8", marginTop: 2, fontSize: 12 },

  iconMini: { padding: 6, borderRadius: 10, backgroundColor: "rgba(148,163,184,0.10)" },
  trashMini: { backgroundColor: "rgba(248,113,113,0.12)" },

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
    alignItems: "center",
    gap: 10,
  },
  itemRowDragging: {
    opacity: 0.92,
    borderColor: "rgba(34,211,238,0.40)",
    backgroundColor: "rgba(34,211,238,0.08)",
  },
  dragHandle: { paddingVertical: 2, paddingHorizontal: 2 },
  itemText: { color: "#E2E8F0", flex: 1, fontWeight: "700" },
  trashBtn: { padding: 6, borderRadius: 10, backgroundColor: "rgba(248,113,113,0.10)" },
});