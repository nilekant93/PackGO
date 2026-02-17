import React from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { Text, Portal, Modal } from "react-native-paper";
import { X } from "lucide-react-native";
import type { Bag } from "../../../app/create-trip";

export default function BagPickerModal({
  visible,
  onClose,
  availableBags,
  onSelectBag,
  title,
  emptyText,
  emptySubText,
}: {
  visible: boolean;
  onClose: () => void;
  availableBags: Bag[];
  onSelectBag: (bag: Bag) => void;
  title: string;
  emptyText: string;
  emptySubText: string;
}) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalWrap}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Pressable onPress={onClose} style={styles.modalClose} hitSlop={10}>
            <X size={18} color="#E2E8F0" />
          </Pressable>
        </View>

        {availableBags.length === 0 ? (
          <View style={{ paddingVertical: 18 }}>
            <Text style={{ color: "#94A3B8", textAlign: "center" }}>{emptyText}</Text>
            <Text style={{ color: "#64748B", textAlign: "center", marginTop: 6, fontSize: 12 }}>
              {emptySubText}
            </Text>
          </View>
        ) : (
          <FlatList
            data={availableBags}
            keyExtractor={(b) => b.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item: bag }) => (
              <Pressable onPress={() => onSelectBag(bag)} style={styles.modalBagRow}>
                <Text style={{ fontSize: 20 }}>💼</Text>
                <View>
                  <Text style={{ color: "#E2E8F0", fontWeight: "900" }}>{bag.name}</Text>
                  <Text style={{ color: "#94A3B8", marginTop: 2, fontSize: 12 }}>{bag.type}</Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalWrap: {
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 16,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    maxHeight: "80%",
  },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  modalTitle: { color: "#E2E8F0", fontSize: 16, fontWeight: "900" },
  modalClose: { padding: 6, borderRadius: 10, backgroundColor: "rgba(148,163,184,0.10)" },

  modalBagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(148,163,184,0.06)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
  },
});
