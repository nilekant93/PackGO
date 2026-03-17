import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Check } from "lucide-react-native";
import LottieView from "lottie-react-native";
import { MotiView } from "moti";
import { RenderIcon } from "../../items/item-icons";
import PackingItemAurora from "./PackingItemAurora";
import PackingProgressRing from "./PackingProgressRing";

export type PackingFlowItem = {
  id: string;
  name: string;
  checked: boolean;
  iconId?: string;
};

const ITEM_CIRCLE_SIZE = 230;
const bagCompletedAnimation = require("../../../../assets/animations/BagCompleted.json");

type DisplayState = {
  item: PackingFlowItem | null;
  itemIndex: number;
  totalCount: number;
  isCompleted: boolean;
};

export default function PackingCurrentItemCard({
  bagName,
  item,
  itemIndex,
  totalCount,
  onLater,
  onPacked,
  hasNextBag,
  onNextBag,
}: {
  bagName: string;
  item: PackingFlowItem | null;
  itemIndex: number;
  totalCount: number;
  onLater: () => void;
  onPacked: () => void;
  hasNextBag: boolean;
  onNextBag: () => void;
}) {
  const isCompleted = item === null;
  const progress =
    totalCount > 0 ? (isCompleted ? 1 : itemIndex / totalCount) : 0;

  const incomingKey = `${item?.id ?? "completed"}-${itemIndex}-${totalCount}`;

  const [display, setDisplay] = useState<DisplayState>({
    item,
    itemIndex,
    totalCount,
    isCompleted,
  });
  const [contentVisible, setContentVisible] = useState(true);
  const [completionActionVisible, setCompletionActionVisible] = useState(false);

  const lastKeyRef = useRef(incomingKey);
  const swapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeInTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completionActionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
      if (fadeInTimerRef.current) clearTimeout(fadeInTimerRef.current);
      if (completionActionTimerRef.current) {
        clearTimeout(completionActionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (lastKeyRef.current === incomingKey) return;

    if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
    if (fadeInTimerRef.current) clearTimeout(fadeInTimerRef.current);
    if (completionActionTimerRef.current) {
      clearTimeout(completionActionTimerRef.current);
    }

    setContentVisible(false);
    setCompletionActionVisible(false);

    swapTimerRef.current = setTimeout(() => {
      setDisplay({
        item,
        itemIndex,
        totalCount,
        isCompleted,
      });
    }, 110);

    fadeInTimerRef.current = setTimeout(() => {
      setContentVisible(true);
      lastKeyRef.current = incomingKey;
    }, 190);
  }, [incomingKey, item, itemIndex, totalCount, isCompleted]);

  useEffect(() => {
    if (completionActionTimerRef.current) {
      clearTimeout(completionActionTimerRef.current);
    }

    if (!isCompleted) {
      setCompletionActionVisible(false);
      return;
    }

    completionActionTimerRef.current = setTimeout(() => {
      setCompletionActionVisible(true);
    }, 900);
  }, [isCompleted, bagName]);

  const shownItem = display.item;
  const shownIsCompleted = display.isCompleted;

  const titleText = shownIsCompleted
    ? "Packing completed"
    : shownItem?.name ?? "";

  const metaText = shownIsCompleted
    ? `Everything in ${bagName} is packed.`
    : `Item ${display.itemIndex + 1} of ${display.totalCount}`;

  return (
    <View>
      <Text style={styles.sectionTitle}>Current item</Text>

      <View style={styles.card}>
        <Text style={styles.bagLabel}>{bagName}</Text>

        <View style={styles.visualWrap}>
          <View style={styles.circleWrap}>
            <View style={styles.itemCircle}>
              <PackingItemAurora size={ITEM_CIRCLE_SIZE} />
              <PackingProgressRing
                size={ITEM_CIRCLE_SIZE}
                progress={progress}
                strokeWidth={8}
              />

              {!shownIsCompleted && shownItem && (
                <MotiView
                  animate={{
                    opacity: contentVisible ? 1 : 0,
                    scale: contentVisible ? 1 : 0.94,
                  }}
                  transition={{
                    type: "timing",
                    duration: 110,
                  }}
                  style={styles.iconCenter}
                >
                  <RenderIcon
                    iconId={shownItem.iconId}
                    size={92}
                    color="#F8FAFC"
                  />
                </MotiView>
              )}
            </View>

            {shownIsCompleted && (
              <View style={styles.lottieOverlay} pointerEvents="none">
                <LottieView
                  source={bagCompletedAnimation}
                  autoPlay
                  loop={false}
                  speed={1.5}
                  style={styles.lottie}
                />
              </View>
            )}
          </View>

          <View style={styles.textStage}>
            <MotiView
              animate={{
                opacity: contentVisible ? 1 : 0,
                translateY: contentVisible ? 0 : 5,
              }}
              transition={{
                type: "timing",
                duration: 110,
              }}
              style={styles.textSwapWrap}
            >
              <Text style={styles.itemName}>{titleText}</Text>
              <Text style={styles.itemMeta}>{metaText}</Text>
            </MotiView>
          </View>
        </View>

        {!isCompleted && (
          <>
            <Pressable onPress={onPacked} style={styles.primaryBtnWrap}>
              <LinearGradient
                colors={["#0891B2", "#2563EB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryBtn}
              >
                <Check size={18} color="#E2E8F0" />
                <Text style={styles.primaryBtnText}>Packed</Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={onLater} style={styles.skipWrap}>
              <Text style={styles.skipText}>Skip now</Text>
            </Pressable>
          </>
        )}

        {isCompleted && (
          <View style={styles.completionArea}>
            <MotiView
              animate={{
                opacity: completionActionVisible ? 1 : 0,
                translateY: completionActionVisible ? 0 : 8,
              }}
              transition={{
                type: "timing",
                duration: 220,
              }}
              style={styles.completionActionWrap}
            >
              {hasNextBag ? (
                <Pressable onPress={onNextBag} style={styles.primaryBtnWrap}>
                  <LinearGradient
                    colors={["#2b7d7c", "#2b7d7c"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryBtn}
                  >
                    <Text style={styles.primaryBtnText}>To next bag</Text>
                  </LinearGradient>
                </Pressable>
              ) : (
                <View style={styles.completionMessageBox}>
                  <Text style={styles.completionMessageTitle}>
                    Everything packed
                  </Text>
                  <Text style={styles.completionMessageText}>
                    Nice. You can relax now — everything is ready to go.
                  </Text>
                </View>
              )}
            </MotiView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 10,
  },

  card: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(148, 163, 184, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.22)",
    minHeight: 360,
    justifyContent: "space-between",
  },

  bagLabel: {
    color: "#22D3EE",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },

  visualWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
    paddingBottom: 4,
  },

  circleWrap: {
    width: ITEM_CIRCLE_SIZE,
    height: ITEM_CIRCLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },

  itemCircle: {
    width: ITEM_CIRCLE_SIZE,
    height: ITEM_CIRCLE_SIZE,
    borderRadius: ITEM_CIRCLE_SIZE / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  iconCenter: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },

  lottieOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },

  lottie: {
    width: 720,
    height: 720,
    transform: [{ translateY: 6 }, { scale: 1.08 }],
  },

  textStage: {
    width: "100%",
    minHeight: 72,
    marginTop: 14,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  textSwapWrap: {
    width: "100%",
    alignItems: "center",
  },

  itemName: {
    color: "#E2E8F0",
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "900",
    textAlign: "center",
  },

  itemMeta: {
    color: "#94A3B8",
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

  primaryBtnWrap: {
    marginTop: 16,
    width: "100%",
  },

  primaryBtn: {
    minHeight: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    width: "100%",
  },

  primaryBtnText: {
    color: "#E2E8F0",
    fontWeight: "900",
    fontSize: 16,
  },

  skipWrap: {
    alignSelf: "center",
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },

  skipText: {
    color: "#94A3B8",
    fontWeight: "800",
    fontSize: 14,
    textDecorationLine: "underline",
  },

  completionArea: {
    minHeight: 80,
    justifyContent: "flex-end",
  },

  completionActionWrap: {
    width: "100%",
  },

  completionMessageBox: {
    marginTop: 16,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  completionMessageTitle: {
    color: "#E2E8F0",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },

  completionMessageText: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    textAlign: "center",
  },
});