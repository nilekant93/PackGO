import React, { useMemo, useState } from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { Text, Portal, Modal, TextInput } from "react-native-paper";
import { Plus, Trash2, ChevronDown, ChevronRight, X } from "lucide-react-native";
import { AnimatePresence, MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

import type { Bag, Item, Preset } from "../../app/create-trip";

export type BagWithItems = Bag & {
  items: Item[];
  isExpanded: boolean;
};

type PickTarget =
  | { kind: "preset"; preset: Preset }
  | { kind: "custom"; itemName: string };

export default function BagsAndItemsStep({
  itemPresets,
  allBags,
  selectedBags,
  onSelectedBagsChange,
}: {
  itemPresets: Preset[];
  allBags: Bag[];
  selectedBags: BagWithItems[];
  onSelectedBagsChange: (bags: BagWithItems[]) => void;
}) {
  const [isBagSelectorOpen, setIsBagSelectorOpen] = useState(false);
  const [pickTarget, setPickTarget] = useState<PickTarget | null>(null);

  // ✅ active bag
  const [activeBagId, setActiveBagId] = useState<string | null>(null);

  // Custom item input (global; lisää valittuun laukkuun)
  const [newItemName, setNewItemName] = useState("");

  const availableBags = useMemo(
    () => allBags.filter((b) => !selectedBags.some((sb) => sb.id === b.id)),
    [allBags, selectedBags]
  );

  const activeBag = useMemo(
    () => (activeBagId ? selectedBags.find((b) => b.id === activeBagId) : undefined),
    [activeBagId, selectedBags]
  );

  const activeBagName = activeBag?.name ?? "";

  const addBagToTrip = (bag: Bag) => {
    const next = [...selectedBags, { ...bag, items: [], isExpanded: true }];
    onSelectedBagsChange(next);

    // ✅ ensimmäinen laukku automaattisesti aktiiviseksi
    if (next.length === 1) setActiveBagId(bag.id);
  };

  const removeBagFromTrip = (bagId: string) => {
    const next = selectedBags.filter((b) => b.id !== bagId);
    onSelectedBagsChange(next);

    // ✅ jos poistettiin aktiivinen, valitse uusi aktiivinen
    if (activeBagId === bagId) {
      setActiveBagId(next.length ? next[0].id : null);
    }
  };

  const toggleBagExpand = (bagId: string) => {
    // togglaa expand ja aseta samalla aktiiviseksi
    onSelectedBagsChange(
      selectedBags.map((b) =>
        b.id === bagId ? { ...b, isExpanded: !b.isExpanded } : b
      )
    );
    setActiveBagId(bagId);
  };

  const addItemsToBag = (bagId: string, itemsToAdd: Item[]) => {
    onSelectedBagsChange(
      selectedBags.map((b) => (b.id === bagId ? { ...b, items: [...b.items, ...itemsToAdd] } : b))
    );
  };

  const removeItemFromBag = (bagId: string, itemId: string) => {
    onSelectedBagsChange(
      selectedBags.map((b) => (b.id === bagId ? { ...b, items: b.items.filter((i) => i.id !== itemId) } : b))
    );
  };

  // ✅ valitse kohdelaukku: active -> jos ei active, 1 bag -> muuten kysy
  const resolveTargetBagIdOrAsk = (target: PickTarget): string | null => {
    if (selectedBags.length === 0) return null;

    // 1) active bag
    if (activeBagId && selectedBags.some((b) => b.id === activeBagId)) return activeBagId;

    // 2) only one bag
    if (selectedBags.length === 1) return selectedBags[0].id;

    // 3) ask
    setPickTarget(target);
    setIsBagSelectorOpen(true);
    return null;
  };

  // ---------- Preset click ----------
  const onPressPreset = (preset: Preset) => {
    const bagId = resolveTargetBagIdOrAsk({ kind: "preset", preset });
    if (!bagId) return;
    addPresetToBag(preset, bagId);
  };

  const addPresetToBag = (preset: Preset, bagId: string) => {
    const newItems: Item[] = preset.items.map((name) => ({
      id: `${Date.now()}-${Math.random()}`,
      name,
      checked: false,
    }));
    addItemsToBag(bagId, newItems);
  };

  // ---------- Custom item add ----------
  const onAddCustomItem = () => {
    const name = newItemName.trim();
    if (!name) return;

    const bagId = resolveTargetBagIdOrAsk({ kind: "custom", itemName: name });
    if (!bagId) return;

    addCustomToBag(name, bagId);
    setNewItemName("");
  };

  const addCustomToBag = (itemName: string, bagId: string) => {
    const item: Item = { id: String(Date.now()), name: itemName, checked: false };
    addItemsToBag(bagId, [item]);
  };

  const onChooseBag = (bag: Bag) => {
    if (!pickTarget) return;

    // ✅ valittu bag myös aktiiviseksi
    setActiveBagId(bag.id);

    if (pickTarget.kind === "preset") {
      addPresetToBag(pickTarget.preset, bag.id);
    } else {
      addCustomToBag(pickTarget.itemName, bag.id);
      setNewItemName("");
    }

    setPickTarget(null);
    setIsBagSelectorOpen(false);
  };

  const addItemDisabled = selectedBags.length === 0 || !newItemName.trim();

  const addItemLabel =
    selectedBags.length === 0
      ? "Add items to a bag"
      : activeBag
      ? `Add items to "${activeBagName}"`
      : "Add items to a bag";

  const presetHint =
    selectedBags.length === 0
      ? "💡 Add a bag first, then you can add presets into it"
      : activeBag
      ? `💡 Presets will be added to "${activeBagName}"`
      : selectedBags.length === 1
      ? "💡 Tap a preset to add it to your bag"
      : "💡 Tap a preset, then choose a bag";

  return (
    <MotiView
      from={{ opacity: 0, translateX: 18 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 220 }}
      style={{ gap: 18 }}
    >
      {/* Presets */}
      <View style={styles.block}>
        <Text style={styles.label}>Quick Add Presets</Text>
        <Text style={styles.hint}>{presetHint}</Text>

        <View style={styles.presetWrap}>
          {itemPresets.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => onPressPreset(p)}
              disabled={selectedBags.length === 0}
              style={({ pressed }) => [
                styles.presetChip,
                { opacity: selectedBags.length === 0 ? 0.45 : pressed ? 0.9 : 1 },
              ]}
            >
              <Plus size={14} color="#E2E8F0" />
              <Text style={styles.presetText}>{p.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Add Item input */}
      <View style={styles.block}>
        <Text style={styles.label}>{addItemLabel}</Text>

        <TextInput
          mode="outlined"
          value={newItemName}
          onChangeText={setNewItemName}
          placeholder={selectedBags.length === 0 ? "Add a bag first..." : "Item name"}
          disabled={selectedBags.length === 0}
          outlineColor="rgba(148,163,184,0.25)"
          activeOutlineColor="#22D3EE"
          style={styles.input}
          textColor="#E2E8F0"
          placeholderTextColor="#64748B"
          theme={{ roundness: 14 }}
          onSubmitEditing={onAddCustomItem}
          returnKeyType="done"
        />

        <View style={{ marginTop: 12 }}>
          <GradientButton label="Add Item" onPress={onAddCustomItem} disabled={addItemDisabled} />
        </View>

        {selectedBags.length > 1 && !activeBag && (
          <Text style={[styles.hint, { marginTop: 10 }]}>
            Tip: tap a bag to make it active. Otherwise you’ll be asked which bag to use.
          </Text>
        )}
      </View>

      {/* Bags (active highlight) */}
      <View style={styles.block}>
        <View style={styles.bagsHeader}>
          <Text style={styles.label}>Your Bags ({selectedBags.length})</Text>

          <Pressable onPress={() => setIsBagSelectorOpen(true)} style={styles.addBagBtn}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addBagText}>Add Bag</Text>
          </Pressable>
        </View>

        {selectedBags.length === 0 ? (
          <View style={styles.emptyBags}>
            <Text style={styles.emptyBagsText}>Add at least one bag to continue</Text>

            <Pressable onPress={() => setIsBagSelectorOpen(true)} style={styles.emptyAddBtn}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.emptyAddBtnText}>Add Your First Bag</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {selectedBags.map((bag) => (
              <BagCard
                key={bag.id}
                bag={bag}
                isActive={bag.id === activeBagId}
                onToggleExpand={() => toggleBagExpand(bag.id)}
                onMakeActive={() => setActiveBagId(bag.id)}
                onRemoveBag={() => removeBagFromTrip(bag.id)}
                onRemoveItem={(itemId) => removeItemFromBag(bag.id, itemId)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Modals */}
      <BagPickerModal
        visible={isBagSelectorOpen}
        onClose={() => {
          setIsBagSelectorOpen(false);
          setPickTarget(null);
        }}
        availableBags={pickTarget ? selectedBags : availableBags}
        title={pickTarget ? "Select a bag" : "Add a bag"}
        onSelectBag={(bag) => {
          if (pickTarget) onChooseBag(bag);
          else {
            addBagToTrip(bag);
            setIsBagSelectorOpen(false);
          }
        }}
        emptyText={pickTarget ? "No bags selected yet" : "No bags available"}
        emptySubText={pickTarget ? "Add a bag first" : "Create bags in the Catalog page"}
      />
    </MotiView>
  );
}

function BagCard({
  bag,
  isActive,
  onToggleExpand,
  onMakeActive,
  onRemoveBag,
  onRemoveItem,
}: {
  bag: BagWithItems;
  isActive: boolean;
  onToggleExpand: () => void;
  onMakeActive: () => void;
  onRemoveBag: () => void;
  onRemoveItem: (itemId: string) => void;
}) {
  return (
    <View
      style={[
        styles.bagCard,
        isActive && {
          borderColor: "#22D3EE",
          backgroundColor: "rgba(34,211,238,0.10)",
        },
      ]}
    >
      <Pressable
        onPress={() => {
          onMakeActive();
          onToggleExpand();
        }}
        style={styles.bagHeaderRow}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 20 }}>💼</Text>
          <View>
            <Text style={styles.bagName}>{bag.name}</Text>
            <Text style={styles.bagMeta}>
              {bag.type} • {bag.items.length} items
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onRemoveBag();
            }}
            style={styles.trashMini}
            hitSlop={10}
          >
            <Trash2 size={16} color="#F87171" />
          </Pressable>

          {bag.isExpanded ? (
            <ChevronDown size={20} color="#E2E8F0" />
          ) : (
            <ChevronRight size={20} color="#E2E8F0" />
          )}
        </View>
      </Pressable>

      <AnimatePresence>
        {bag.isExpanded && (
          <MotiView
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "timing", duration: 220 }}
            style={styles.bagBody}
          >
            {bag.items.length === 0 ? (
              <View style={styles.bagEmpty}>
                <Text style={styles.bagEmptyText}>Add presets above or add items using the input.</Text>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {bag.items.map((it) => (
                  <View key={it.id} style={styles.itemRow}>
                    <Text style={{ color: "#E2E8F0" }}>{it.name}</Text>
                    <Pressable onPress={() => onRemoveItem(it.id)} style={styles.trashBtn} hitSlop={6}>
                      <X size={14} color="#F87171" />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}

function BagPickerModal({
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

function GradientButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [{ opacity: disabled ? 0.45 : pressed ? 0.92 : 1 }]}>
      <LinearGradient colors={["#0891B2", "#2563EB"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBtn}>
        <Text style={styles.gradientBtnText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 14 },
  label: { color: "#CBD5E1", marginBottom: 8 },
  hint: { color: "#94A3B8", fontSize: 12, marginBottom: 10 },

  presetWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  presetChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(37,99,235,0.18)",
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.28)",
  },
  presetText: { color: "#E2E8F0", fontSize: 13, fontWeight: "800" },

  input: { backgroundColor: "rgba(148,163,184,0.06)" },

  gradientBtn: {
    width: "100%",
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  gradientBtnText: { color: "#E2E8F0", fontWeight: "900", fontSize: 16 },

  bagsHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  addBagBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: "#0891B2" },
  addBagText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },

  emptyBags: {
    paddingVertical: 22,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "rgba(148,163,184,0.06)",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(148,163,184,0.25)",
    alignItems: "center",
  },
  emptyBagsText: { color: "#94A3B8", fontSize: 13 },
  emptyAddBtn: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: "#0891B2" },
  emptyAddBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },

  bagCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(148,163,184,0.25)",
    backgroundColor: "rgba(148,163,184,0.06)",
    overflow: "hidden",
  },
  bagHeaderRow: { paddingHorizontal: 14, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bagName: { color: "#E2E8F0", fontWeight: "900" },
  bagMeta: { color: "#94A3B8", marginTop: 2, fontSize: 12 },

  trashMini: { padding: 6, borderRadius: 10, backgroundColor: "rgba(248,113,113,0.12)" },

  bagBody: { paddingHorizontal: 14, paddingBottom: 14 },
  bagEmpty: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(148,163,184,0.22)",
    backgroundColor: "rgba(148,163,184,0.04)",
    alignItems: "center",
  },
  bagEmptyText: { color: "#94A3B8", fontSize: 12 },

  itemRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(148,163,184,0.06)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trashBtn: { padding: 6, borderRadius: 10, backgroundColor: "rgba(248,113,113,0.10)" },

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
