import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { Portal, Modal, Text, TextInput } from "react-native-paper";
import { X, Plus } from "lucide-react-native";
import type { BagImageId, BagType } from "./types";
import { BAG_TYPES, getBagImageSrc } from "./types";
import GradientButton from "./GradientButton";

export default function CreateBagModal({
  visible,
  mode, // ✅ "create" | "edit"
  name,
  type,
  imageId,
  onChangeName,
  onChangeType,
  onOpenImagePicker,
  onClose,
  onSubmit, // ✅ create/save
}: {
  visible: boolean;
  mode: "create" | "edit";
  name: string;
  type: BagType;
  imageId: BagImageId;
  onChangeName: (v: string) => void;
  onChangeType: (t: BagType) => void;
  onOpenImagePicker: () => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const canSubmit = name.trim().length > 0;

  const title = mode === "edit" ? "Edit Bag" : "New Bag";
  const cta = mode === "edit" ? "Save changes" : "Create bag";

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.wrap}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable onPress={onClose} style={styles.close} hitSlop={10}>
            <X size={18} color="#E2E8F0" />
          </Pressable>
        </View>

        <View style={{ gap: 12 }}>
          {/* Picture */}
          <View>
            <Text style={styles.label}>Picture</Text>

            <View style={styles.pictureRow}>
              <View style={styles.previewWrap}>
                <View style={styles.preview}>
                  <Image source={getBagImageSrc(imageId)} style={styles.previewImg} resizeMode="cover" />
                </View>

                <Pressable
                  onPress={onOpenImagePicker}
                  style={({ pressed }) => [styles.cornerPlus, { opacity: pressed ? 0.9 : 1 }]}
                  hitSlop={10}
                >
                  <Plus size={16} color="#FFFFFF" strokeWidth={2} />
                </Pressable>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.helperTitle}>Change profile picture</Text>
                <Text style={styles.helperSub}>
                  Tap the <Text style={{ color: "#E2E8F0", fontWeight: "900" }}>+</Text> to select an icon.
                </Text>

                <Pressable
                  onPress={onOpenImagePicker}
                  style={({ pressed }) => [styles.helperBtn, { opacity: pressed ? 0.92 : 1 }]}
                >
                  <Text style={styles.helperBtnText}>Choose picture</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Name */}
          <View>
            <Text style={styles.label}>Bag name</Text>
            <TextInput
              mode="outlined"
              value={name}
              onChangeText={onChangeName}
              placeholder="e.g., Suitcase"
              outlineColor="rgba(148,163,184,0.25)"
              activeOutlineColor="#22D3EE"
              style={styles.input}
              textColor="#E2E8F0"
              placeholderTextColor="#64748B"
              theme={{ roundness: 14 }}
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />
          </View>

          {/* Type */}
          <View>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeGrid}>
              {BAG_TYPES.map((t) => {
                const selected = t.value === type;
                return (
                  <Pressable
                    key={t.value}
                    onPress={() => onChangeType(t.value)}
                    style={[
                      styles.typeChip,
                      {
                        borderColor: selected ? "#22D3EE" : "rgba(148,163,184,0.22)",
                        backgroundColor: selected ? "rgba(34,211,238,0.12)" : "rgba(148,163,184,0.06)",
                      },
                    ]}
                  >
                    <Text style={{ color: "#E2E8F0", fontWeight: "900", fontSize: 12 }}>{t.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={{ marginTop: 6 }}>
            <GradientButton label={cta} onPress={onSubmit} disabled={!canSubmit} />
          </View>

          <Pressable onPress={onClose} style={({ pressed }) => [styles.cancel, { opacity: pressed ? 0.9 : 1 }]}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </Portal>
  );
}

const PREVIEW_SIZE = 64;

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

  label: { color: "#CBD5E1", marginBottom: 8, fontWeight: "800" },
  input: { backgroundColor: "rgba(148,163,184,0.06)" },

  pictureRow: { flexDirection: "row", alignItems: "center", gap: 14 },

  previewWrap: { width: PREVIEW_SIZE, height: PREVIEW_SIZE, position: "relative" },
  preview: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(34,211,238,0.35)",
    backgroundColor: "rgba(148,163,184,0.06)",
  },
  previewImg: { width: "100%", height: "100%" },

  cornerPlus: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0891B2",
    borderWidth: 2,
    borderColor: "#0F172A",
  },

  helperTitle: { color: "#E2E8F0", fontWeight: "900" },
  helperSub: { color: "#94A3B8", marginTop: 2, fontSize: 12 },

  helperBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    backgroundColor: "rgba(148,163,184,0.06)",
  },
  helperBtnText: { color: "#E2E8F0", fontWeight: "900", fontSize: 12 },

  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, borderWidth: 2 },

  cancel: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(148,163,184,0.10)",
  },
  cancelText: { color: "#E2E8F0", fontWeight: "900" },
});
