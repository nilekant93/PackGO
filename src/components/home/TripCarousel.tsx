import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import type { Trip } from "../../storage/trips";
import TripCarouselCard from "./TripCarouselCard";
import AddTripCard from "./AddTripCard";

const { width: SCREEN_W } = Dimensions.get("window");

const GAP = 12;
// responsiivinen korttileveys (clamp)
const CARD_W = Math.min(360, Math.max(260, SCREEN_W * 0.78));
const SNAP = CARD_W + GAP;

type CarouselItem =
  | { kind: "trip"; trip: Trip }
  | { kind: "add" };

export default function TripCarousel({
  trips,
  onPressTrip,
  onPressAddTrip,
}: {
  trips: Trip[];
  onPressTrip: (trip: Trip) => void;
  onPressAddTrip: () => void;
}) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList<CarouselItem>>(null);

  const data: CarouselItem[] = useMemo(
    () => [...trips.map((t) => ({ kind: "trip", trip: t } as const)), { kind: "add" as const }],
    [trips]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / SNAP);
    setActiveIndex(Math.max(0, Math.min(idx, data.length - 1)));
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<CarouselItem>) => {
    const inputRange = [(index - 1) * SNAP, index * SNAP, (index + 1) * SNAP];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.94, 1, 0.94],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.78, 1, 0.78],
      extrapolate: "clamp",
    });

    return (
      <Animated.View style={{ transform: [{ scale }], opacity, marginRight: index === data.length - 1 ? 0 : GAP }}>
        {item.kind === "trip" ? (
          <TripCarouselCard trip={item.trip} width={CARD_W} onPress={() => onPressTrip(item.trip)} />
        ) : (
          <AddTripCard width={CARD_W} onPress={onPressAddTrip} />
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.shell}>
      <View style={styles.shellHeader}>
        <Text style={styles.shellTitle}>Trips</Text>
        <Text style={styles.shellHint}>Swipe</Text>
      </View>

      <Animated.FlatList
        ref={listRef}
        horizontal
        data={data}
        keyExtractor={(it, idx) => (it.kind === "trip" ? `trip-${it.trip.id}` : `add-${idx}`)}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SNAP}
        snapToAlignment="start"
        disableIntervalMomentum
        bounces={false}
        contentContainerStyle={styles.listContent} // vasemmalle ankkuroitu
        onMomentumScrollEnd={onMomentumEnd}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
      />

      <View style={styles.dotsRow}>
        {data.map((it, i) => {
          const isActive = i === activeIndex;
          const isAdd = it.kind === "add";
          return (
            <View
              key={`${it.kind}-${i}`}
              style={[
                styles.dot,
                isActive && styles.dotActive,
                isAdd && styles.dotAdd,
                isAdd && isActive && styles.dotAddActive,
              ]}
            >
              {isAdd && <Text style={[styles.dotPlus, isActive && styles.dotPlusActive]}>+</Text>}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    backgroundColor: "rgba(148,163,184,0.08)",
    overflow: "hidden",
    paddingTop: 12,
    paddingBottom: 12,
  },

  shellHeader: {
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shellTitle: { color: "#E2E8F0", fontWeight: "900", fontSize: 13 },
  shellHint: { color: "#94A3B8", fontSize: 12, fontWeight: "700" },

  listContent: {
    paddingLeft: 14, // ✅ vasen reuna
    paddingRight: 14, // ✅ oikea reuna
    paddingTop: 6,
    paddingBottom: 8,
  },

  dotsRow: {
    marginTop: 2,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "rgba(148,163,184,0.35)",
  },
  dotActive: {
    backgroundColor: "#22D3EE",
    width: 16,
  },

  // last dot = add-trip
  dotAdd: {
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: "rgba(34,211,238,0.14)",
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  dotAddActive: {
    backgroundColor: "rgba(34,211,238,0.28)",
    borderColor: "rgba(34,211,238,0.55)",
  },
  dotPlus: {
    color: "rgba(226,232,240,0.85)",
    fontSize: 10,
    fontWeight: "900",
    marginTop: -0.5,
  },
  dotPlusActive: {
    color: "#FFFFFF",
  },
});