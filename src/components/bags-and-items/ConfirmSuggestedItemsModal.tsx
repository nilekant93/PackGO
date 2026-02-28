import React from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";
import { X, Check } from "lucide-react-native";
import { MotiView } from "moti";

import GradientButton from "../bags/GradientButton";

export type SuggestedItem = {
  name: string;
  reason?: string;
};

export default function ConfirmSuggestedItemsModal({
  visible,
  bagName,
  bagType,
  items,
  selected,
  onToggleItem,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  bagName: string;
  bagType: string;
  items: SuggestedItem[];
  selected: boolean[];
  onToggleItem: (index: number) => void;
  onConfirm: (selectedItems: string[]) => void;
  onCancel: () => void;
}) {
  const selectedNames = items.filter((_, i) => selected[i]).map((x) => x.name);
  const noneSelected = selectedNames.length === 0;

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onCancel} contentContainerStyle={styles.wrap}>
        {/* HEADER (fixed) */}
        <View style={styles.header}>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.title}>Suggested items</Text>
            <Text style={styles.sub} numberOfLines={2}>
              Add suggestions to <Text style={styles.subStrong}>&quot;{bagName}&quot;</Text>{" "}
              <Text style={styles.subMuted}>({bagType})</Text>?
            </Text>
          </View>

          <Pressable onPress={onCancel} style={styles.close} hitSlop={10}>
            <X size={18} color="#E2E8F0" />
          </Pressable>
        </View>

        <Text style={styles.helper}>Uncheck items you don’t want to add.</Text>

        {/* LIST (scrollable) */}
        <View style={styles.listWrap}>
          <FlatList
            data={items}
            keyExtractor={(it, idx) => `${it.name}-${idx}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item, index }) => {
              const isOn = selected[index];

              return (
                <MotiView
                  from={{ opacity: 0, translateY: 6 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", duration: 500, delay: index * 70 }}
                >
                  <Pressable onPress={() => onToggleItem(index)} hitSlop={6}>
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

                      <View style={{ flex: 1 }}>
                        <Text style={styles.rowText} numberOfLines={1}>
                          {item.name}
                        </Text>
                        {!!item.reason && (
                          <Text style={styles.reason} numberOfLines={1}>
                            {item.reason}
                          </Text>
                        )}
                      </View>
                    </MotiView>
                  </Pressable>
                </MotiView>
              );
            }}
          />
        </View>

        {/* FOOTER (fixed) */}
        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <GradientButton
              label={noneSelected ? "Select at least one" : `Add ${selectedNames.length} items`}
              onPress={() => onConfirm(selectedNames)}
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
  // ✅ Give the modal a stable height so the list can scroll inside it
  wrap: {
    marginHorizontal: 16,
    borderRadius: 22,
    padding: 16,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    height: "82%", // <-- important for fixed header/footer + scroll list
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
  subMuted: { color: "#64748B", fontWeight: "800" },

  close: { padding: 6, borderRadius: 10, backgroundColor: "rgba(148,163,184,0.10)" },
  helper: { color: "#94A3B8", fontSize: 12, marginBottom: 12 },

  // ✅ this is the scroll area
  listWrap: {
    flex: 1,
    minHeight: 0, // <-- important on Android for FlatList inside a flex container
  },
  listContent: {
    paddingBottom: 10, // little breathing room before footer
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8, // replaces ItemSeparatorComponent, keeps animations smooth
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  rowText: { color: "#E2E8F0", fontWeight: "800" },
  reason: { color: "#94A3B8", fontSize: 12, marginTop: 2 },

  footer: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 10,
  },
});