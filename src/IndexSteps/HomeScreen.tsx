import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "react-native-paper";

import { useTrips } from "../hooks/useTrips";
import type { Trip } from "../storage/trips";

import TripCarousel from "../components/home/TripCarousel";
import HomeEmptyState from "../components/home/HomeEmptyState";

export default function HomeScreen() {
  const router = useRouter();
  const { trips, isHydrated, refresh } = useTrips();

  const [refreshing, setRefreshing] = useState(false);

  const oneTimeTrips = useMemo(
    () => trips.filter((t) => t.mode === "oneTime") as Trip[],
    [trips]
  );

  const onOpenTrip = (tripId: string) => {
    router.push({
      pathname: "/trip/[id]",
      params: { id: tripId },
    });
  };

  const onAddTrip = () => {
    router.push("/create-trip");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22D3EE" />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Your Trips
        </Text>
        <Text style={styles.subtitle}>Swipe to browse. Tap to open checklist.</Text>
      </View>

      {!isHydrated && <Text style={styles.muted}>Loading…</Text>}

      {isHydrated && oneTimeTrips.length === 0 ? (
        <HomeEmptyState />
      ) : (
        <TripCarousel trips={oneTimeTrips} onPressTrip={(t) => onOpenTrip(t.id)} onPressAddTrip={onAddTrip} />
      )}

      <View style={{ height: 18 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 14,
    paddingBottom: 28,
    backgroundColor: "#0B1220",
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: { color: "#FFFFFF", fontWeight: "800" },
  subtitle: { color: "rgba(255,255,255,0.78)", marginTop: 4, fontSize: 12 },
  muted: { color: "#94A3B8", paddingHorizontal: 16, marginTop: 6 },
});