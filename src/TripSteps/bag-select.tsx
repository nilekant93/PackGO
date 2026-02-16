import { Check } from "lucide-react-native";
import { MotiView } from "moti";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import type { Bag } from "../../app/create-trip";

export default function BagSelectStep({
  bags,
  selectedBags,
  onSelectedBagsChange,
}: {
  bags: Bag[];
  selectedBags: Bag[];
  onSelectedBagsChange: (bags: Bag[]) => void;
}) {
  const toggleBag = (bag: Bag) => {
    onSelectedBagsChange(
      selectedBags.some((b) => b.id === bag.id)
        ? selectedBags.filter((b) => b.id !== bag.id)
        : [...selectedBags, bag]
    );
  };

  return (
    <MotiView from={{ opacity: 0, translateX: 18 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: "timing", duration: 220 }}>
      <View style={styles.block}>
        <Text style={{ color: "#CBD5E1", marginBottom: 12 }}>
          Select the bags you'll be using for this trip
        </Text>

        <View style={{ gap: 10 }}>
          {bags.map((bag) => {
            const selected = selectedBags.some((b) => b.id === bag.id);
            return (
              <Pressable
                key={bag.id}
                onPress={() => toggleBag(bag)}
                style={[
                  styles.bagRow,
                  {
                    borderColor: selected ? "#22D3EE" : "rgba(148,163,184,0.25)",
                    backgroundColor: selected ? "rgba(34,211,238,0.12)" : "rgba(148,163,184,0.08)",
                  },
                ]}
              >
                <View>
                  <Text style={{ color: "#E2E8F0", fontWeight: "600" }}>{bag.name}</Text>
                  <Text style={{ color: "#94A3B8", marginTop: 2, fontSize: 12 }}>{bag.type}</Text>
                </View>
                {selected && <Check size={20} color="#22D3EE" />}
              </Pressable>
            );
          })}
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 14 },
  bagRow: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
