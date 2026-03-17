import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import PackingBagChip, { type PackingBagChipItem } from "./PackingBagChip";

export type PackingBagSelectorItem = PackingBagChipItem & {
  checkedCount?: number;
  totalCount?: number;
};

export default function PackingBagSelector({
  bags,
  activeBagId,
  onSelectBag,
}: {
  bags: PackingBagSelectorItem[];
  activeBagId: string | null;
  onSelectBag: (bagId: string) => void;
}) {
  if (bags.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>No bags available for packing.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.title}>Choose a bag</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {bags.map((bag) => (
          <View key={bag.id} style={styles.itemWrap}>
            <PackingBagChip
              bag={bag}
              active={bag.id === activeBagId}
              onPress={() => onSelectBag(bag.id)}
            />

            {typeof bag.checkedCount === "number" && typeof bag.totalCount === "number" && (
              <Text style={styles.progressText}>
                {bag.checkedCount}/{bag.totalCount}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 10,
  },

  scrollContent: {
    gap: 12,
    paddingRight: 4,
  },

  itemWrap: {
    alignItems: "center",
    width: 88,
  },

  progressText: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
  },

  emptyWrap: {
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    backgroundColor: "rgba(148,163,184,0.05)",
    alignItems: "center",
  },

  emptyText: {
    color: "#94A3B8",
    fontSize: 12,
  },
});