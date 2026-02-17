import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { Plus } from "lucide-react-native";
import type { Bag } from "../../../app/create-trip";
import type { BagWithItems } from "../../TripSteps/bags-and-items";
import BagCard from "./BagCard";

export default function BagList({
  selectedBags,
  activeBagId,
  onOpenAddBag,
  onToggleExpand,
  onMakeActive,
  onRemoveBag,
  onRemoveItem,
}: {
  selectedBags: BagWithItems[];
  activeBagId: string | null;
  onOpenAddBag: () => void;
  onToggleExpand: (bagId: string) => void;
  onMakeActive: (bagId: string) => void;
  onRemoveBag: (bagId: string) => void;
  onRemoveItem: (bagId: string, itemId: string) => void;
}) {
  return (
    <View style={styles.block}>
      <View style={styles.bagsHeader}>
        <Text style={styles.label}>Your Bags ({selectedBags.length})</Text>

        <Pressable onPress={onOpenAddBag} style={styles.addBagBtn}>
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addBagText}>Add Bag</Text>
        </Pressable>
      </View>

      {selectedBags.length === 0 ? (
        <View style={styles.emptyBags}>
          <Text style={styles.emptyBagsText}>Add at least one bag to continue</Text>

          <Pressable onPress={onOpenAddBag} style={styles.emptyAddBtn}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.emptyAddBtnText}>Add Your First Bag</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {selectedBags.map((bag) => (
            <BagCard
              key={bag.id}
              bag={bag}
              isActive={bag.id === activeBagId}
              onToggleExpand={() => onToggleExpand(bag.id)}
              onMakeActive={() => onMakeActive(bag.id)}
              onRemoveBag={() => onRemoveBag(bag.id)}
              onRemoveItem={(itemId) => onRemoveItem(bag.id, itemId)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 14 },
  label: { color: "#CBD5E1", marginBottom: 8 },

  bagsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  addBagBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#0891B2",
  },
  addBagText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },

  emptyBags: {
    paddingVertical: 22,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "rgba(148,163,184,0.06)",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(148,163,184,0.25)",
    alignItems: "center",
  },
  emptyBagsText: { color: "#94A3B8", fontSize: 13 },
  emptyAddBtn: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#0891B2",
  },
  emptyAddBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },
});
