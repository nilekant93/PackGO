import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import * as Haptics from "expo-haptics";
import { X } from "lucide-react-native";

import PackingBagSelector, {
  type PackingBagSelectorItem,
} from "./packing/PackingBagSelector";
import PackingCurrentItemCard, {
  type PackingFlowItem,
} from "./packing/PackingCurrentItemCard";

type PackingBag = {
  id: string;
  name: string;
  imageId?: string;
  items: { id: string; name: string; checked: boolean; iconId?: string }[];
};

type ModalBagState = {
  id: string;
  name: string;
  imageId?: string;
  items: PackingFlowItem[];
  history: string[];
};

export default function StartPackingModal({
  visible,
  onClose,
  tripName,
  bags,
}: {
  visible: boolean;
  onClose: () => void;
  tripName?: string;
  bags: PackingBag[];
}) {
  const [activeBagId, setActiveBagId] = useState<string | null>(null);
  const [bagStates, setBagStates] = useState<ModalBagState[]>([]);

  useEffect(() => {
    if (!visible) return;

    const nextStates: ModalBagState[] = bags.map((bag) => ({
      id: bag.id,
      name: bag.name,
      imageId: bag.imageId,
      items: [...bag.items].reverse(),
      history: [],
    }));

    setBagStates(nextStates);
    setActiveBagId(nextStates[0]?.id ?? null);
  }, [visible, bags]);

  const selectorBags: PackingBagSelectorItem[] = useMemo(
    () =>
      bagStates.map((bag) => ({
        id: bag.id,
        name: bag.name,
        imageId: bag.imageId,
        checkedCount: bag.history.length,
        totalCount: bag.history.length + bag.items.length,
      })),
    [bagStates]
  );

  const activeBag = useMemo(
    () => bagStates.find((b) => b.id === activeBagId) ?? null,
    [bagStates, activeBagId]
  );

  const currentItem = activeBag?.items[0] ?? null;
  const currentIndex = activeBag ? activeBag.history.length : 0;
  const totalCount = activeBag
    ? activeBag.history.length + activeBag.items.length
    : 0;

  const nextIncompleteBagId = useMemo(() => {
    if (!activeBag) return null;

    const currentIndex = bagStates.findIndex((b) => b.id === activeBag.id);
    if (currentIndex === -1) return null;

    const ordered = [
      ...bagStates.slice(currentIndex + 1),
      ...bagStates.slice(0, currentIndex),
    ];

    const nextBag = ordered.find((bag) => bag.items.length > 0);
    return nextBag?.id ?? null;
  }, [bagStates, activeBag]);

  const handleSelectBag = async (bagId: string) => {
    setActiveBagId(bagId);
    await Haptics.selectionAsync();
  };

  const handlePacked = async () => {
    if (!activeBag || !currentItem) return;

    const isLastItem = activeBag.items.length === 1;

    if (isLastItem) {
      setTimeout(() => {
        const pulses = [0, 60, 120, 180, 240];
        pulses.forEach((delay, i) => {
          setTimeout(() => {
            Haptics.impactAsync(
              i % 2 === 0
                ? Haptics.ImpactFeedbackStyle.Medium
                : Haptics.ImpactFeedbackStyle.Heavy
            );
          }, delay);
        });
      }, 140);
    } else {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    }

    setBagStates((prev) =>
      prev.map((bag) => {
        if (bag.id !== activeBag.id) return bag;

        const [first, ...rest] = bag.items;
        if (!first) return bag;

        return {
          ...bag,
          items: rest,
          history: [...bag.history, first.id],
        };
      })
    );
  };

  const handleLater = async () => {
    if (!activeBag || !currentItem) return;

    await Haptics.selectionAsync();

    setBagStates((prev) =>
      prev.map((bag) => {
        if (bag.id !== activeBag.id) return bag;
        if (bag.items.length <= 1) return bag;

        const [first, ...rest] = bag.items;
        return {
          ...bag,
          items: [...rest, first],
        };
      })
    );
  };

  const handleNextBag = async () => {
    if (!nextIncompleteBagId) return;
    setActiveBagId(nextIncompleteBagId);
    await Haptics.selectionAsync();
  };

  const handleClose = async () => {
    await Haptics.selectionAsync();
    onClose();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modalWrap}
      >
        <View style={styles.sheet}>
          <View style={styles.closeWrap}>
            <Pressable
              onPress={handleClose}
              hitSlop={8}
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && styles.closeBtnPressed,
              ]}
            >
              <X size={20} color="#E2E8F0" />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.topSpacer} />

            <PackingBagSelector
              bags={selectorBags}
              activeBagId={activeBagId}
              onSelectBag={handleSelectBag}
            />

            <View style={styles.sectionGap} />

            <View style={styles.cardWrap}>
              <PackingCurrentItemCard
                bagName={activeBag?.name ?? "Bag"}
                item={currentItem}
                itemIndex={currentIndex}
                totalCount={totalCount}
                onLater={handleLater}
                onPacked={handlePacked}
                hasNextBag={Boolean(nextIncompleteBagId)}
                onNextBag={handleNextBag}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalWrap: {
    marginHorizontal: 16,
    justifyContent: "center",
  },

  sheet: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 460,
    height: 760,
    borderRadius: 22,
    backgroundColor: "#111A2B",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    overflow: "hidden",
    position: "relative",
  },

  closeWrap: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 20,
  },

  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  closeBtnPressed: {
    transform: [{ scale: 0.94 }],
    backgroundColor: "rgba(255,255,255,0.16)",
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  topSpacer: {
    height: 40,
  },

  sectionGap: {
    height: 22,
  },

  cardWrap: {
    flex: 1,
    justifyContent: "flex-start",
  },
});