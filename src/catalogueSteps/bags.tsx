import React, { useState } from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { ArrowLeft, Plus } from "lucide-react-native";
import { MotiView } from "moti";

import type { Bag, BagImageId, BagType } from "../components/bags/types";
import BagCard from "../components/bags/BagCard";
import EmptyBags from "../components/bags/EmptyBags";
import GradientButton from "../components/bags/GradientButton";
import CreateBagModal from "../components/bags/CreateBagModal";
import BagImagePickerModal from "../components/bags/BagImagePickerModal";

import { useBags } from "../hooks/useBags";

export default function BagsStep({ onBack }: { onBack: () => void }) {
  const { bags, addBag, updateBag, removeBag } = useBags();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState<BagType>("Suitcase");
  const [imageId, setImageId] = useState<BagImageId>("suitcase");

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setName("");
    setType("Suitcase");
    setImageId("suitcase");
    setIsModalOpen(true);
  };

  const openEdit = (bag: Bag) => {
    setMode("edit");
    setEditingId(bag.id);
    setName(bag.name);
    setType(bag.type);
    setImageId(bag.imageId);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const submit = () => {
    if (!name.trim()) return;

    if (mode === "create") {
      const newBag: Bag = {
        id: String(Date.now()),
        name: name.trim(),
        type,
        imageId,
      };
      addBag(newBag);
      setIsModalOpen(false);
      return;
    }

    // edit
    if (!editingId) return;
    updateBag(editingId, { name: name.trim(), type, imageId });
    setIsModalOpen(false);
  };

  const onRemoveBag = (id: string) => {
    removeBag(id);
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: 18 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 220 }}
      style={{ gap: 14 }}
    >
      {/* Header row */}
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.backRow} hitSlop={10}>
          <ArrowLeft size={18} color="#E2E8F0" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Pressable onPress={openCreate} style={styles.addBtn} hitSlop={10}>
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Bag</Text>
        </Pressable>
      </View>

      {bags.length === 0 ? (
        <EmptyBags onAdd={openCreate} />
      ) : (
        <View style={{ gap: 10 }}>
          <Text style={styles.sectionTitle}>Your Bags ({bags.length})</Text>

          <FlatList
            data={bags}
            keyExtractor={(b) => b.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <BagCard
                bag={item}
                onEdit={() => openEdit(item)}
                onRemove={() => onRemoveBag(item.id)}
              />
            )}
          />

          <View style={{ marginTop: 4 }}>
            <GradientButton label="Add another bag" onPress={openCreate} />
          </View>
        </View>
      )}

      {/* Modals */}
      <CreateBagModal
        visible={isModalOpen}
        mode={mode}
        name={name}
        type={type}
        imageId={imageId}
        onChangeName={setName}
        onChangeType={setType}
        onOpenImagePicker={() => setIsImagePickerOpen(true)}
        onClose={closeModal}
        onSubmit={submit}
      />

      <BagImagePickerModal
        visible={isImagePickerOpen}
        imageId={imageId}
        onClose={() => setIsImagePickerOpen(false)}
        onPick={setImageId}
      />
    </MotiView>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  backText: { color: "#E2E8F0", fontWeight: "900" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#0891B2",
  },
  addBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },
  sectionTitle: { color: "#CBD5E1", fontWeight: "900" },
  tip: { color: "#94A3B8", fontSize: 12, marginTop: -2 },
});