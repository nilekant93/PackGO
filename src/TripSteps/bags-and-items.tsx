import { MotiView } from "moti";
import React, { useMemo, useState } from "react";

import type { Bag, Item, Preset } from "../../app/create-trip";
import AddItemPanel from "../components/bags-and-items/AddItemPanel";
import BagList from "../components/bags-and-items/BagList";
import BagPickerModal from "../components/bags-and-items/BagPickerModal";
import PresetsBar from "../components/bags-and-items/PresetsBar";

import ConfirmAddPresetModal from "../components/bags-and-items/ConfirmAddPresetModal";

import { getBagSuggestions } from "../recommendations/engine";
import type { RecommendedItem } from "../recommendations/types";
import ConfirmSuggestedItemsModal, { type SuggestedItem } from "../components/bags-and-items/ConfirmSuggestedItemsModal";

import CreateBagModal from "../components/bags/CreateBagModal";
import BagImagePickerModal from "../components/bags/BagImagePickerModal";
import type { BagImageId, BagType } from "../components/bags/types";

export type BagWithItems = Bag & {
  items: Item[];
  isExpanded: boolean;
};

type PickTarget =
  | { kind: "preset"; preset: Preset }
  | { kind: "custom"; itemName: string };

type BagModalMode = "create" | "edit";

export default function BagsAndItemsStep({
  itemPresets,
  selectedBags,
  onSelectedBagsChange,
  transportModes,
  tripTypesSelected,
  mode,
}: {
  itemPresets: Preset[];
  selectedBags: BagWithItems[];
  onSelectedBagsChange: (bags: BagWithItems[]) => void;

  transportModes?: string[];
  tripTypesSelected?: string[];
  mode?: "oneTime" | "routine" | null;
}) {
  const [activeBagId, setActiveBagId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");

  const [isBagSelectorOpen, setIsBagSelectorOpen] = useState(false);
  const [pickTarget, setPickTarget] = useState<PickTarget | null>(null);

  // ✅ Bag create/edit modals
  const [bagModalOpen, setBagModalOpen] = useState(false);
  const [bagModalMode, setBagModalMode] = useState<BagModalMode>("create");
  const [editingBagId, setEditingBagId] = useState<string | null>(null);

  const [bagName, setBagName] = useState("");
  const [bagType, setBagType] = useState<BagType>("Suitcase");
  const [bagImageId, setBagImageId] = useState<BagImageId>("suitcase");
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  const openCreateBag = () => {
    setBagModalMode("create");
    setEditingBagId(null);
    setBagName("");
    setBagType("Suitcase");
    setBagImageId("suitcase");
    setBagModalOpen(true);
  };

  const openEditBag = (bagId: string) => {
    const bag = selectedBags.find((b) => b.id === bagId);
    if (!bag) return;

    setBagModalMode("edit");
    setEditingBagId(bagId);
    setBagName(bag.name);
    setBagType(bag.type as BagType);
    setBagImageId(bag.imageId as BagImageId);
    setBagModalOpen(true);
  };

  // ✅ preset confirm state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPreset, setConfirmPreset] = useState<Preset | null>(null);
  const [confirmBagId, setConfirmBagId] = useState<string | null>(null);
  const [confirmSelected, setConfirmSelected] = useState<boolean[]>([]);

  const openConfirmForPreset = (preset: Preset, bagId: string) => {
    setConfirmPreset(preset);
    setConfirmBagId(bagId);
    setConfirmSelected(preset.items.map(() => true));
    setConfirmOpen(true);
  };

  // ✅ AI suggestions modal state
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestBagId, setSuggestBagId] = useState<string | null>(null);
  const [suggestItems, setSuggestItems] = useState<SuggestedItem[]>([]);
  const [suggestSelected, setSuggestSelected] = useState<boolean[]>([]);

  const activeBag = useMemo(
    () => (activeBagId ? selectedBags.find((b) => b.id === activeBagId) : undefined),
    [activeBagId, selectedBags]
  );

  const addItemsToBag = (bagId: string, itemsToAdd: Item[]) => {
    onSelectedBagsChange(
      selectedBags.map((b) => (b.id === bagId ? { ...b, items: [...b.items, ...itemsToAdd] } : b))
    );
  };

  const reorderItemsInBag = (bagId: string, nextItems: Item[]) => {
    onSelectedBagsChange(selectedBags.map((b) => (b.id === bagId ? { ...b, items: nextItems } : b)));
  };

  const removeBagFromTrip = (bagId: string) => {
    const next = selectedBags.filter((b) => b.id !== bagId);
    onSelectedBagsChange(next);
    if (activeBagId === bagId) setActiveBagId(next.length ? next[0].id : null);
  };

  const toggleBagExpand = (bagId: string) => {
    onSelectedBagsChange(selectedBags.map((b) => (b.id === bagId ? { ...b, isExpanded: !b.isExpanded } : b)));
    setActiveBagId(bagId);
  };

  const removeItemFromBag = (bagId: string, itemId: string) => {
    onSelectedBagsChange(
      selectedBags.map((b) => (b.id === bagId ? { ...b, items: b.items.filter((i) => i.id !== itemId) } : b))
    );
  };

  const openSuggestionsForNewEmptyBag = (bag: Bag) => {
    const recs: RecommendedItem[] = getBagSuggestions(
      {
        bagType: bag.type,
        transportModes: transportModes ?? [],
        tripTypesSelected: tripTypesSelected ?? [],
        mode: mode ?? null,
        existingItemNames: [],
      },
      { limit: 12 }
    );

    const uiItems: SuggestedItem[] = recs.map((r) => ({ name: r.name, reason: r.reason }));
    if (uiItems.length === 0) return;

    setSuggestBagId(bag.id);
    setSuggestItems(uiItems);
    setSuggestSelected(uiItems.map(() => true));
    setSuggestOpen(true);
  };

  const addBagToTrip = (bag: Bag, opts?: { skipSuggestions?: boolean }) => {
    const next: BagWithItems[] = [...selectedBags, { ...bag, items: [], isExpanded: true }];
    onSelectedBagsChange(next);

    if (next.length === 1 || !activeBagId) setActiveBagId(bag.id);

    if (!opts?.skipSuggestions) setTimeout(() => openSuggestionsForNewEmptyBag(bag), 0);
  };

  const resolveTargetBagIdOrAsk = (target: PickTarget): string | null => {
    if (selectedBags.length === 0) {
      setPickTarget(target);
      openCreateBag();
      return null;
    }

    if (activeBagId && selectedBags.some((b) => b.id === activeBagId)) return activeBagId;
    if (selectedBags.length === 1) return selectedBags[0].id;

    setPickTarget(target);
    setIsBagSelectorOpen(true);
    return null;
  };

  const onPressPreset = (preset: Preset) => {
    const bagId = resolveTargetBagIdOrAsk({ kind: "preset", preset });
    if (!bagId) return;
    openConfirmForPreset(preset, bagId);
  };

  const onAddCustomItem = () => {
    const name = newItemName.trim();
    if (!name) return;

    const bagId = resolveTargetBagIdOrAsk({ kind: "custom", itemName: name });
    if (!bagId) return;

    const item: Item = { id: String(Date.now()), name, checked: false };
    addItemsToBag(bagId, [item]);
    setNewItemName("");
  };

  const onChooseBag = (bag: Bag) => {
    if (!pickTarget) return;

    setActiveBagId(bag.id);

    if (pickTarget.kind === "preset") {
      openConfirmForPreset(pickTarget.preset, bag.id);
    } else {
      const item: Item = { id: String(Date.now()), name: pickTarget.itemName, checked: false };
      addItemsToBag(bag.id, [item]);
      setNewItemName("");
    }

    setPickTarget(null);
    setIsBagSelectorOpen(false);
  };

  const submitBagModal = () => {
    const name = bagName.trim();
    if (!name) return;

    if (bagModalMode === "create") {
      const newBag: Bag = {
        id: String(Date.now()),
        name,
        type: bagType,
        imageId: bagImageId,
      };

      const pending = pickTarget;
      addBagToTrip(newBag, { skipSuggestions: !!pending });
      setBagModalOpen(false);

      if (pending) {
        setActiveBagId(newBag.id);

        if (pending.kind === "preset") openConfirmForPreset(pending.preset, newBag.id);
        else {
          const item: Item = { id: String(Date.now()), name: pending.itemName, checked: false };
          addItemsToBag(newBag.id, [item]);
          setNewItemName("");
        }

        setPickTarget(null);
        return;
      }

      setTimeout(() => openSuggestionsForNewEmptyBag(newBag), 0);
      return;
    }

    // ✅ edit mode
    if (!editingBagId) return;

    onSelectedBagsChange(
      selectedBags.map((b) =>
        b.id === editingBagId ? { ...b, name, type: bagType, imageId: bagImageId } : b
      )
    );

    setBagModalOpen(false);
    setEditingBagId(null);
  };

  const addItemDisabled = selectedBags.length === 0 || !newItemName.trim();

  const addItemLabel =
    selectedBags.length === 0
      ? "Add items to a bag"
      : activeBag
      ? `Add items to "${activeBag.name}"`
      : "Add items to a bag";

  const presetHint =
    selectedBags.length === 0
      ? "💡 Add a bag first, then you can add presets into it"
      : activeBag
      ? `💡 Presets will be added to "${activeBag.name}"`
      : selectedBags.length === 1
      ? "💡 Tap a preset to add it to your bag"
      : "💡 Tap a preset, then choose a bag";

  const confirmBagName = selectedBags.find((b) => b.id === confirmBagId)?.name ?? "Bag";
  const suggestBagName = selectedBags.find((b) => b.id === suggestBagId)?.name ?? "Bag";
  const suggestBagTypeLabel = selectedBags.find((b) => b.id === suggestBagId)?.type ?? "";

  return (
    <MotiView
      from={{ opacity: 0, translateX: 18 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 220 }}
      style={{ gap: 18 }}
    >
      <PresetsBar
        itemPresets={itemPresets}
        disabled={selectedBags.length === 0}
        hint={presetHint}
        onPressPreset={onPressPreset}
      />

      <AddItemPanel
        label={addItemLabel}
        value={newItemName}
        onChangeText={setNewItemName}
        disabled={selectedBags.length === 0}
        onAdd={onAddCustomItem}
        addDisabled={addItemDisabled}
        showTip={selectedBags.length > 1 && !activeBag}
      />

      <BagList
        selectedBags={selectedBags}
        activeBagId={activeBagId}
        onOpenAddBag={openCreateBag}
        onToggleExpand={toggleBagExpand}
        onMakeActive={(id) => setActiveBagId(id)}
        onRemoveBag={removeBagFromTrip}
        onRemoveItem={removeItemFromBag}
        onEditBag={openEditBag}
        onReorderItems={reorderItemsInBag}
      />

      <BagPickerModal
        visible={isBagSelectorOpen}
        onClose={() => {
          setIsBagSelectorOpen(false);
          setPickTarget(null);
        }}
        availableBags={selectedBags}
        title="Select a bag"
        onSelectBag={(bag) => onChooseBag(bag)}
        emptyText="No bags selected yet"
        emptySubText="Create a bag first"
      />

      {/* ✅ Create/Edit Bag Modal */}
      <CreateBagModal
        visible={bagModalOpen}
        mode={bagModalMode}
        name={bagName}
        type={bagType}
        imageId={bagImageId}
        onChangeName={setBagName}
        onChangeType={setBagType}
        onOpenImagePicker={() => setIsImagePickerOpen(true)}
        onClose={() => {
          setBagModalOpen(false);
          setEditingBagId(null);
        }}
        onSubmit={submitBagModal}
      />

      <BagImagePickerModal
        visible={isImagePickerOpen}
        imageId={bagImageId}
        onClose={() => setIsImagePickerOpen(false)}
        onPick={setBagImageId}
      />

      <ConfirmAddPresetModal
        visible={confirmOpen}
        bagName={confirmBagName}
        presetName={confirmPreset?.name ?? "Preset"}
        items={confirmPreset?.items ?? []}
        selected={confirmSelected}
        onToggleItem={(index) => setConfirmSelected((prev) => prev.map((v, i) => (i === index ? !v : v)))}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmPreset(null);
          setConfirmBagId(null);
          setConfirmSelected([]);
        }}
        onConfirm={(selectedItems) => {
          if (!confirmPreset || !confirmBagId) return;

          const newItems: Item[] = selectedItems.map((name) => ({
            id: `${Date.now()}-${Math.random()}`,
            name,
            checked: false,
          }));

          addItemsToBag(confirmBagId, newItems);

          setConfirmOpen(false);
          setConfirmPreset(null);
          setConfirmBagId(null);
          setConfirmSelected([]);
        }}
      />

      <ConfirmSuggestedItemsModal
        visible={suggestOpen}
        bagName={suggestBagName}
        bagType={suggestBagTypeLabel}
        items={suggestItems}
        selected={suggestSelected}
        onToggleItem={(index) => setSuggestSelected((prev) => prev.map((v, i) => (i === index ? !v : v)))}
        onCancel={() => {
          setSuggestOpen(false);
          setSuggestBagId(null);
          setSuggestItems([]);
          setSuggestSelected([]);
        }}
        onConfirm={(selectedNames) => {
          if (!suggestBagId) return;

          const newItems: Item[] = selectedNames.map((name) => ({
            id: `${Date.now()}-${Math.random()}`,
            name,
            checked: false,
          }));

          addItemsToBag(suggestBagId, newItems);

          setSuggestOpen(false);
          setSuggestBagId(null);
          setSuggestItems([]);
          setSuggestSelected([]);
        }}
      />
    </MotiView>
  );
}