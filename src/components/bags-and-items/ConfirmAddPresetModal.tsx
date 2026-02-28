import React from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";
import { X, Check } from "lucide-react-native";
import { MotiView } from "moti";

import GradientButton from "../bags/GradientButton";

export default function ConfirmAddPresetModal({
  visible,
  bagName,
  presetName,
  items,
  selected,
  onToggleItem,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  bagName: string;
  presetName: string;
  items: string[];
  selected: boolean[];
  onToggleItem: (index: number) => void;
  onConfirm: (selectedItems: string[]) => void;
  onCancel: () => void;
}) {
  const selectedItems = items.filter((_, i) => selected[i]);
  const noneSelected = selectedItems.length === 0;

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onCancel} contentContainerStyle={styles.wrap}>
        <View style={styles.header}>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.title}>Add preset to bag</Text>
            <Text style={styles.sub} numberOfLines={2}>
              Add <Text style={styles.subStrong}>&quot;{presetName}&quot;</Text> to{" "}
              <Text style={styles.subStrong}>&quot;{bagName}&quot;</Text>?
            </Text>
          </View>

          <Pressable onPress={onCancel} style={styles.close} hitSlop={10}>
            <X size={18} color="#E2E8F0" />
          </Pressable>
        </View>

        <Text style={styles.helper}>Uncheck items you don’t want to add.</Text>

        <View style={styles.listWrap}>
          <FlatList
            data={items}
            keyExtractor={(_, idx) => String(idx)}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item, index }) => {
              const isOn = selected[index];

              return (
                // ✅ Stagger appear on modal open
                <MotiView
                  from={{ opacity: 0, translateY: 6 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{
                    type: "timing",
                    duration: 500, // 0.5s
                    delay: index * 70, // 👈 stagger step (tweak 50–90)
                  }}
                >
                  <Pressable onPress={() => onToggleItem(index)} hitSlop={6}>
                    {/* ✅ Your existing toggle animation stays inside */}
                    <MotiView
                      animate={{
                        opacity: isOn ? 1 : 0.92,
                        backgroundColor: isOn ? "rgba(148, 163, 184, 0.13)" : "rgba(0,0,0,0)",
                        borderColor: "rgba(148, 163, 184, 0)",
                      }}
                      transition={{ type: "timing", duration: 160 }}
                      style={styles.row}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          isOn
                            ? {
                                borderColor: "rgba(34,211,238,0.70)",
                                backgroundColor: "rgba(34,211,238,0.16)",
                              }
                            : {
                                borderColor: "rgba(148,163,184,0.28)",
                                backgroundColor: "transparent",
                              },
                        ]}
                      >
                        {isOn && <Check size={14} color="#E2E8F0" />}
                      </View>

                      <Text style={styles.rowText} numberOfLines={1}>
                        {item}
                      </Text>
                    </MotiView>
                  </Pressable>
                </MotiView>
              );
            }}
          />
        </View>

        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <GradientButton
              label={noneSelected ? "Select at least one" : `Add ${selectedItems.length} items`}
              onPress={() => onConfirm(selectedItems)}
              disabled={noneSelected}
            />
          </View>

          <View style={{ flex: 1 }}>
            <GradientButton label="Cancel" onPress={onCancel} />
          </View>
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
    maxHeight: "82%",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  title: { color: "#E2E8F0", fontSize: 16, fontWeight: "900" },
  sub: { color: "#94A3B8", marginTop: 6, fontSize: 12 },
  subStrong: { color: "#CBD5E1", fontWeight: "900" },
  close: { padding: 6, borderRadius: 10, backgroundColor: "rgba(148,163,184,0.10)" },

  helper: { color: "#94A3B8", fontSize: 12, marginBottom: 12 },

  listWrap: {
    paddingVertical: 6,
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  rowText: { color: "#E2E8F0", fontWeight: "800", flexShrink: 1 },

  footer: { flexDirection: "row", gap: 10 },
});