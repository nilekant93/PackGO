import { Trash2 } from "lucide-react-native";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import type { Bag } from "./types";
import { getBagImageSrc } from "./types";

export default function BagCard({
  bag,
  onRemove,
  onEdit,
}: {
  bag: Bag;
  onRemove: () => void;
  onEdit: () => void;
}) {
  return (
    <Pressable
      onPress={onEdit}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.92 : 1 }]}
    >
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Image source={getBagImageSrc(bag.imageId)} style={styles.avatarImg} resizeMode="cover" />
        </View>

        <View style={{ flexShrink: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {bag.name}
          </Text>
          <Text style={styles.type}>{bag.type}</Text>

          {/* ✅ small helper hint */}
          <View style={styles.hintRow}>
            <Text style={styles.hint}>Press to edit</Text>
          </View>
        </View>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    backgroundColor: "rgba(148,163,184,0.06)",
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
  },
  avatarImg: { width: "100%", height: "100%" },
  name: { color: "#E2E8F0", fontWeight: "900" },
  type: { color: "#94A3B8", marginTop: 2, fontSize: 12 },

  hintRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  hint: { color: "#94A3B8", fontSize: 11, fontWeight: "700" },

  trash: { padding: 8, borderRadius: 12, backgroundColor: "rgba(248,113,113,0.10)" },
});
