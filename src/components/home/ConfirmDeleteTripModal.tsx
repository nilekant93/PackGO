import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function ConfirmDeleteTripModal({
  visible,
  tripName,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  tripName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>Delete trip?</Text>
          <Text style={styles.desc}>
            This will permanently delete{" "}
            <Text style={{ fontWeight: "800", color: "#E2E8F0" }}>"{tripName}"</Text>.
          </Text>

          <View style={styles.row}>
            <Button mode="outlined" onPress={onCancel} textColor="#94A3B8" style={{ flex: 1 }}>
              Cancel
            </Button>

            <Button
              mode="contained"
              onPress={onConfirm}
              buttonColor="#EF4444"
              textColor="#0B1220"
              style={{ flex: 1, marginLeft: 10 }}
            >
              Delete
            </Button>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
  },
  title: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  desc: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  row: { flexDirection: "row", alignItems: "center" },
});