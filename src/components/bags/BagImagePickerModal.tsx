import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { Portal, Modal, Text } from "react-native-paper";
import { X } from "lucide-react-native";
import { BAG_IMAGES } from "./types";
import type { BagImageId } from "./types";

export default function BagImagePickerModal({
  visible,
  imageId,
  onClose,
  onPick,
}: {
  visible: boolean;
  imageId: BagImageId;
  onClose: () => void;
  onPick: (id: BagImageId) => void;
}) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.wrap}>
        <View style={styles.header}>
          <Text style={styles.title}>Select picture</Text>
          <Pressable onPress={onClose} style={styles.close} hitSlop={10}>
            <X size={18} color="#E2E8F0" />
          </Pressable>
        </View>

        <View style={styles.grid}>
          {BAG_IMAGES.map((img) => {
            const selected = img.id === imageId;
            return (
              <Pressable
                key={img.id}
                onPress={() => {
                  onPick(img.id);
                  onClose();
                }}
                style={[
                  styles.pick,
                  {
                    borderColor: selected ? "#22D3EE" : "rgba(148,163,184,0.18)",
                    backgroundColor: selected ? "rgba(34,211,238,0.10)" : "rgba(148,163,184,0.06)",
                  },
                ]}
              >
                <View style={styles.circle}>
                  <Image source={img.src} style={styles.circleImg} resizeMode="cover" />
                </View>
                <Text style={styles.label} numberOfLines={1}>
                  {img.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 16,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  title: { color: "#E2E8F0", fontSize: 16, fontWeight: "900" },
  close: { padding: 6, borderRadius: 10, backgroundColor: "rgba(148,163,184,0.10)" },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  pick: {
    width: "31.5%",
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  circle: { width: 48, height: 48, borderRadius: 999, overflow: "hidden", backgroundColor: "rgba(148,163,184,0.06)" },
  circleImg: { width: "100%", height: "100%" },
  label: { color: "#CBD5E1", fontSize: 11, fontWeight: "800" },
});
