import React, { useMemo, useState } from "react";
import { MotiView } from "moti";

import type { Bag, Item, Preset } from "../../app/create-trip";
import PresetsBar from "../components/bags-and-items/PresetsBar";
import AddItemPanel from "../components/bags-and-items/AddItemPanel";
import BagList from "../components/bags-and-items/BagList";
import BagPickerModal from "../components/bags-and-items/BagPickerModal";

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

  const [activeBagId, setActiveBagId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");

  const availableBags = useMemo(
    () => allBags.filter((b) => !selectedBags.some((sb) => sb.id === b.id)),
    [allBags, selectedBags]
  );

  const activeBag = useMemo(
    () => (activeBagId ? selectedBags.find((b) => b.id === activeBagId) : undefined),
    [activeBagId, selectedBags]
  );

  const addBagToTrip = (bag: Bag) => {
    const next = [...selectedBags, { ...bag, items: [], isExpanded: true }];
    onSelectedBagsChange(next);
    if (next.length === 1) setActiveBagId(bag.id);
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

  const addItemsToBag = (bagId: string, itemsToAdd: Item[]) => {
    onSelectedBagsChange(
      selectedBags.map((b) => (b.id === bagId ? { ...b, items: [...b.items, ...itemsToAdd] } : b))
    );
  };

  const removeItemFromBag = (bagId: string, itemId: string) => {
    onSelectedBagsChange(selectedBags.map((b) => (b.id === bagId ? { ...b, items: b.items.filter((i) => i.id !== itemId) } : b)));
  };

  const resolveTargetBagIdOrAsk = (target: PickTarget): string | null => {
    if (selectedBags.length === 0) return null;

    if (activeBagId && selectedBags.some((b) => b.id === activeBagId)) return activeBagId;
    if (selectedBags.length === 1) return selectedBags[0].id;

    setPickTarget(target);
    setIsBagSelectorOpen(true);
    return null;
  };

  const addPresetToBag = (preset: Preset, bagId: string) => {
    const newItems: Item[] = preset.items.map((name) => ({
      id: `${Date.now()}-${Math.random()}`,
      name,
      checked: false,
    }));
    addItemsToBag(bagId, newItems);
  };

  const onPressPreset = (preset: Preset) => {
    const bagId = resolveTargetBagIdOrAsk({ kind: "preset", preset });
    if (!bagId) return;
    addPresetToBag(preset, bagId);
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

    if (pickTarget.kind === "preset") addPresetToBag(pickTarget.preset, bag.id);
    else {
      const item: Item = { id: String(Date.now()), name: pickTarget.itemName, checked: false };
      addItemsToBag(bag.id, [item]);
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
        onOpenAddBag={() => setIsBagSelectorOpen(true)}
        onToggleExpand={toggleBagExpand}
        onMakeActive={(id) => setActiveBagId(id)}
        onRemoveBag={removeBagFromTrip}
        onRemoveItem={removeItemFromBag}
      />

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
