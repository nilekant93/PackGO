import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";

export default function StartPackingModal({
  visible,
  onClose,
  tripName,
}: {
  visible: boolean;
  onClose: () => void;
  tripName?: string;
}) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.sheet}>
        <Text style={styles.title}>Start packing?</Text>
        <Text style={styles.sub}>
          This is a placeholder modal for{" "}
          <Text style={styles.subStrong}>{tripName ?? "your trip"}</Text>. We’ll build the packing flow next.
        </Text>

        <View style={{ height: 14 }} />

        <Button mode="contained" onPress={onClose} buttonColor="#22D3EE" textColor="#0B1220">
          OK
        </Button>

        <View style={{ height: 10 }} />

        <Button mode="text" onPress={onClose} textColor="#94A3B8">
          Close
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#111A2B",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
  },
  title: { color: "#E2E8F0", fontWeight: "900", fontSize: 16 },
  sub: { color: "#94A3B8", marginTop: 6, lineHeight: 18 },
  subStrong: { color: "#E2E8F0", fontWeight: "900" },
});