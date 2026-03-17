import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Trash2 } from "lucide-react-native";
import { MotiView } from "moti";

import BagsAndItemsStep, { type BagWithItems } from "../TripSteps/bags-and-items";
import { deleteTrip, getTrips, upsertTrip, type Trip } from "../storage/trips";
import { usePresets } from "../hooks/usePresets";
import type { Preset } from "../../app/create-trip";
import PackingHeader from "../components/trip/PackingHeader";
import StartPackingModal from "../components/trip/StartPackingModal";
import TripHeroLottie from "../components/trip/TripHeroLottie";

function isOneTimeTrip(t: Trip): t is Extract<Trip, { mode: "oneTime" }> {
  return t.mode === "oneTime";
}

export default function TripScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    presets: storedPresets,
    isHydrated: presetsHydrated,
    refresh: refreshPresets,
  } = usePresets();

  const itemPresets: Preset[] = useMemo(
    () => storedPresets.map((p) => ({ id: p.id, name: p.name, items: p.items })),
    [storedPresets]
  );

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loadingTrip, setLoadingTrip] = useState(true);

  const [selectedBags, setSelectedBags] = useState<BagWithItems[]>([]);
  const [hydratedBags, setHydratedBags] = useState(false);

  const [packingOpen, setPackingOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isDeletingRef = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadTrip = useCallback(async () => {
    setLoadingTrip(true);
    const trips = await getTrips();
    const found = trips.find((t) => t.id === id) ?? null;
    setTrip(found);
    setLoadingTrip(false);
  }, [id]);

  const handleDeleteTrip = async () => {
    if (!trip) return;

    isDeletingRef.current = true;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    await deleteTrip(trip.id);
    setDeleteOpen(false);
    router.replace("/");
  };

  useEffect(() => {
    loadTrip();
    refreshPresets();
  }, [loadTrip, refreshPresets]);

  // Reset local edit state whenever opened trip changes
  useEffect(() => {
    setSelectedBags([]);
    setHydratedBags(false);
    isDeletingRef.current = false;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, [id]);

  // Hydrate bags for the currently opened trip
  useEffect(() => {
    if (!trip) {
      setSelectedBags([]);
      setHydratedBags(false);
      return;
    }

    if (!isOneTimeTrip(trip)) {
      setSelectedBags([]);
      setHydratedBags(false);
      return;
    }

    const next: BagWithItems[] = (trip.bags ?? []).map((b: any) => ({
      ...b,
      isExpanded: typeof b.isExpanded === "boolean" ? b.isExpanded : true,
    }));

    setSelectedBags(next);
    setHydratedBags(true);
  }, [trip?.id]);

  // Autosave edited bags, but never while deleting
  useEffect(() => {
    if (!trip || !hydratedBags) return;
    if (!isOneTimeTrip(trip)) return;
    if (isDeletingRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      if (isDeletingRef.current) return;

      const next = {
        ...trip,
        updatedAtISO: new Date().toISOString(),
        bags: selectedBags,
      };

      setTrip(next);
      await upsertTrip(next);
    }, 350);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [selectedBags, trip, hydratedBags]);

  const title = trip?.name ?? "Trip";
  const subtitle =
    trip?.mode === "routine" ? "Routine trip (edit later)" : "Edit bags & checklist";

  const packedCounts = useMemo(() => {
    if (!trip || !isOneTimeTrip(trip)) return { checked: 0, total: 0 };
    const items = (trip.bags ?? []).flatMap((b: any) => b.items ?? []);
    const checked = items.filter((it: any) => it.checked).length;
    return { checked, total: items.length };
  }, [trip]);

  const canShowOneTimeEditor =
    !loadingTrip && !!trip && isOneTimeTrip(trip) && presetsHydrated && hydratedBags;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroContainer}>
            <TripHeroLottie />

            <LinearGradient
              colors={[
                "rgba(11, 18, 32, 0.64)",
                "rgba(11, 18, 32, 0.47)",
                "rgba(11, 18, 32, 0.09)",
                "rgba(11,18,32,0.92)",
              ]}
              locations={[0, 0.35, 0.72, 1]}
              style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.heroTopRow}>
              <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
                <ArrowLeft size={20} color="#FFFFFF" />
              </Pressable>

              <View style={{ flex: 1 }}>
                <Text style={styles.tripTitle} numberOfLines={1}>
                  {title}
                </Text>
                <Text style={styles.tripSubtitle} numberOfLines={1}>
                  {subtitle}
                </Text>

                {!!trip && isOneTimeTrip(trip) && (
                  <Text style={styles.tripMeta}>
                    Packed {packedCounts.checked}/{packedCounts.total}
                  </Text>
                )}
              </View>

              {!!trip && (
                <Pressable
                  onPress={() => setDeleteOpen(true)}
                  style={styles.deleteBtn}
                  hitSlop={10}
                >
                  <Trash2 size={18} color="#F87171" />
                </Pressable>
              )}
            </View>
          </View>

          <View style={styles.container}>
            {loadingTrip && <Text style={styles.muted}>Loading trip…</Text>}

            {!loadingTrip && !trip && (
              <View style={{ gap: 10 }}>
                <Text style={styles.muted}>Trip not found.</Text>
                <Pressable onPress={() => router.replace("/")} style={styles.backHomeBtn}>
                  <Text style={styles.backHomeText}>Go Home</Text>
                </Pressable>
              </View>
            )}

            {!loadingTrip && trip && !isOneTimeTrip(trip) && (
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Routine trips</Text>
                <Text style={styles.infoText}>
                  This trip is a routine. Editing routines with bags/items can be added next.
                </Text>

                <View style={{ height: 12 }} />

                <Pressable onPress={() => router.replace("/")} style={styles.backHomeBtn}>
                  <Text style={styles.backHomeText}>Back Home</Text>
                </Pressable>
              </View>
            )}

            {canShowOneTimeEditor && (
              <>
                <PackingHeader
                  checked={packedCounts.checked}
                  total={packedCounts.total}
                  onStartPacking={() => setPackingOpen(true)}
                />

                <View style={{ height: 12 }} />

                <MotiView
                  from={{ opacity: 0, translateX: 14 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: "timing", duration: 220 }}
                >
                  <BagsAndItemsStep
                    itemPresets={itemPresets}
                    selectedBags={selectedBags}
                    onSelectedBagsChange={setSelectedBags}
                    transportModes={trip.transportModes}
                    tripTypesSelected={trip.tripTypesSelected}
                    mode={trip.mode}
                  />
                </MotiView>

                <StartPackingModal
                  visible={packingOpen}
                  onClose={() => setPackingOpen(false)}
                  tripName={trip?.name}
                  bags={selectedBags}
                />
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <Portal>
        <Modal
          visible={deleteOpen}
          onDismiss={() => setDeleteOpen(false)}
          contentContainerStyle={styles.deleteModal}
        >
          <Text style={styles.deleteTitle}>Delete trip?</Text>

          <Text style={styles.deleteText}>
            This will permanently remove{" "}
            <Text style={styles.deleteStrong}>{trip?.name ?? "this trip"}</Text> and all its bags.
          </Text>

          <View style={{ height: 16 }} />

          <Button
            mode="contained"
            onPress={handleDeleteTrip}
            buttonColor="#EF4444"
            textColor="#FFFFFF"
          >
            Delete Trip
          </Button>

          <View style={{ height: 8 }} />

          <Button mode="text" onPress={() => setDeleteOpen(false)} textColor="#94A3B8">
            Cancel
          </Button>
        </Modal>
      </Portal>
    </>
  );
}

const HERO_HEIGHT = 260;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B1220" },
  screen: { flex: 1, backgroundColor: "#0B1220" },
  scrollContent: { paddingBottom: 34 },

  heroContainer: {
    height: HERO_HEIGHT,
    width: "100%",
    position: "relative",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    backgroundColor: "#0f214441",
  },

  heroTopRow: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(248,113,113,0.12)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.25)",
  },

  tripTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 20,
    lineHeight: 24,
  },
  tripSubtitle: {
    color: "rgba(255,255,255,0.88)",
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
  },
  tripMeta: {
    color: "#94A3B8",
    marginTop: 6,
    fontSize: 12,
    fontWeight: "800",
  },

  container: {
    paddingHorizontal: 16,
    maxWidth: 520,
    alignSelf: "center",
    width: "100%",
    marginTop: -52,
  },

  muted: { color: "#94A3B8" },

  backHomeBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(34,211,238,0.14)",
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.25)",
  },
  backHomeText: { color: "#E2E8F0", fontWeight: "900" },

  infoCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    backgroundColor: "rgba(148,163,184,0.06)",
    padding: 14,
  },
  infoTitle: { color: "#E2E8F0", fontWeight: "900", fontSize: 14 },
  infoText: { color: "#94A3B8", marginTop: 6, fontSize: 12, lineHeight: 16 },

  deleteModal: {
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#111A2B",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
  },
  deleteTitle: {
    color: "#E2E8F0",
    fontWeight: "900",
    fontSize: 16,
  },
  deleteText: {
    color: "#94A3B8",
    marginTop: 6,
    lineHeight: 18,
  },
  deleteStrong: {
    color: "#E2E8F0",
    fontWeight: "900",
  },
});