// app/create-trip.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { MotiView } from "moti";
import { useFocusEffect } from "@react-navigation/native";

import TripTypeStep from "../src/TripSteps/trip-type";
import TripNameStep from "../src/TripSteps/trip-name";
import BagsAndItemsStep, { BagWithItems } from "../src/TripSteps/bags-and-items";
import TripNameRoutineStep from "../src/TripSteps/trip-name-routine";
import StuffSelectRoutineStep from "../src/TripSteps/stuff-select-routine";

import StepBar from "../src/TripSteps/step-bar";
import GradientButton from "../src/TripSteps/gradient-button";

import { usePresets } from "../src/hooks/usePresets";
import { useBags } from "../src/hooks/useBags";
import type { Bag as CatalogueBag } from "../src/components/bags/types";

import ConfirmCreateTripModal from "../src/components/bags-and-items/ConfirmCreateTripModal";
import { upsertTrip, type Trip } from "../src/storage/trips";

// ---------------- Types ----------------
export type TripMode = "oneTime" | "routine";
export type Step = "mode" | "type" | "items" | "routineName" | "routineItems";

export type Bag = CatalogueBag; // ✅ sisältää imageId:n
export type Item = { id: string; name: string; checked: boolean };
export type Preset = { id: string; name: string; items: string[] };

// ---------------- Assets ----------------
const heroImage = require("../assets/create-trip-hero-guy.png");

// ---------------- Screen ----------------
export default function CreateTrip() {
  const router = useRouter();

  // ✅ Presets from storage (Catalog)
  const {
    presets: storedPresets,
    isHydrated: presetsHydrated,
    refresh: refreshPresets,
  } = usePresets();

  // ✅ Bags from storage (Catalog)
  const {
    bags: storedBags,
    isHydrated: bagsHydrated,
    refresh: refreshBags,
  } = useBags();

  // ✅ Refresh both when screen is focused again (e.g. after going to Catalog and back)
  useFocusEffect(
    React.useCallback(() => {
      refreshPresets();
      refreshBags();
    }, [refreshPresets, refreshBags])
  );

  // Map hook preset type -> CreateTrip Preset type
  const itemPresets: Preset[] = useMemo(
    () => storedPresets.map((p) => ({ id: p.id, name: p.name, items: p.items })),
    [storedPresets]
  );

  // ✅ Bags from storage (keep imageId)
  const bags: Bag[] = useMemo(() => storedBags, [storedBags]);

  // Wizard control
  const [step, setStep] = useState<Step>("mode");
  const [mode, setMode] = useState<TripMode | null>(null);

  // Regular (one-time) state
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState(""); // ISO string
  const [endDate, setEndDate] = useState(""); // ISO string or ""
  const [hasReturn, setHasReturn] = useState(true); // ✅ return optional
  const [transportModes, setTransportModes] = useState<string[]>([]);
  const [tripTypesSelected, setTripTypesSelected] = useState<string[]>([]);

  // Bags + items
  const [selectedBags, setSelectedBags] = useState<BagWithItems[]>([]);

  // Routine state
  const [routineName, setRoutineName] = useState("");
  const [routineKinds, setRoutineKinds] = useState<string[]>([]);
  const [routineItems, setRoutineItems] = useState<Item[]>([]);
  const [routineNewItemName, setRoutineNewItemName] = useState("");

  // ✅ Confirm create modal
  const [confirmCreateOpen, setConfirmCreateOpen] = useState(false);

  // Progress steps
  const stepsForProgress: Step[] =
    mode === "routine" ? ["mode", "routineName", "routineItems"] : ["mode", "type", "items"];

  const currentProgressIndex = Math.max(0, stepsForProgress.indexOf(step));
  const progressCount = stepsForProgress.length;

  const headerSubtitle = (() => {
    switch (step) {
      case "mode":
        return "Choose trip creation mode";
      case "type":
        return "One-time trip details";
      case "items":
        return "Add bags and organize items";
      case "routineName":
        return "Name your routine";
      case "routineItems":
        return "Set routine items";
      default:
        return "";
    }
  })();

  const canGoBack = step !== "mode";

  const back = () => {
    if (step === "mode") return;

    if (mode === "routine") {
      if (step === "routineName") {
        setStep("mode");
        setMode(null);
      } else if (step === "routineItems") {
        setStep("routineName");
      }
      return;
    }

    if (step === "type") {
      setStep("mode");
      setMode(null);
    } else if (step === "items") {
      setStep("type");
    }
  };

  const isBasicsOk = () => {
    if (!tripName.trim()) return false;
    if (transportModes.length === 0) return false;
    if (tripTypesSelected.length === 0) return false;
    if (!startDate) return false;

    if (hasReturn) {
      if (!endDate) return false;
      if (new Date(endDate).getTime() < new Date(startDate).getTime()) return false; // end >= start
    }

    return true;
  };

  const next = () => {
    if (step === "mode") {
      if (!mode) return;
      setStep(mode === "routine" ? "routineName" : "type");
      return;
    }

    if (mode === "routine") {
      if (step === "routineName") {
        if (!routineName.trim()) return;
        setStep("routineItems");
      }
      return;
    }

    if (step === "type") {
      if (isBasicsOk()) setStep("items");
    }
  };

  // --- Trip building + saving (One-time) ---
  const buildOneTimeTrip = (): Trip => {
    const now = new Date().toISOString();

    return {
      id: String(Date.now()),
      mode: "oneTime",
      name: tripName.trim(),

      startDateISO: startDate,
      endDateISO: hasReturn ? endDate : undefined,
      hasReturn,

      transportModes,
      tripTypesSelected,

      bags: selectedBags.map((b) => ({
        id: b.id,
        name: b.name,
        type: String(b.type),
        imageId: (b as any).imageId,
        items: b.items.map((it) => ({ id: it.id, name: it.name, checked: it.checked })),
      })),

      createdAtISO: now,
      updatedAtISO: now,
    };
  };

  const createTrip = async () => {
    if (!isBasicsOk()) return;
    if (selectedBags.length === 0) return;

    // open confirmation modal
    setConfirmCreateOpen(true);
  };

  const confirmCreateTrip = async () => {
    try {
      const trip = buildOneTimeTrip();
      await upsertTrip(trip);
      setConfirmCreateOpen(false);
      router.replace("/");
    } catch (e) {
      // Optional: show snackbar/toast
      setConfirmCreateOpen(false);
    }
  };

  // Routine saving (optional later - currently just navigate)
  const createRoutine = () => {
    if (!routineName.trim() || routineItems.length === 0) return;
    router.replace("/");
  };

  const primaryAction = (() => {
    if (step === "mode") return { label: "Continue", disabled: !mode, onPress: next };

    if (mode === "routine") {
      if (step === "routineName") {
        return { label: "Continue to Items", disabled: !routineName.trim(), onPress: next };
      }
      if (step === "routineItems") {
        return { label: "Create Routine", disabled: routineItems.length === 0, onPress: createRoutine };
      }
    }

    if (step === "type") {
      return {
        label: "Continue to Items",
        disabled: !isBasicsOk(),
        onPress: next,
      };
    }

    if (step === "items") {
      return { label: "Create Trip", disabled: selectedBags.length === 0, onPress: createTrip };
    }

    return { label: "Continue", disabled: false, onPress: next };
  })();

  const needsExtraBtnGap = step === "mode" || step === "routineName" || step === "routineItems";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={styles.kav} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* HERO */}
            <View style={styles.heroContainer}>
              <Image source={heroImage} style={styles.heroBackground} resizeMode="cover" />
              <LinearGradient
                colors={["rgba(0,0,0,0.08)", "rgba(0,0,0,0.25)", "rgba(11,18,32,0.85)", "#0B1220"]}
                locations={[0, 0.45, 0.82, 1]}
                style={StyleSheet.absoluteFillObject}
              />

              <View style={styles.heroContent}>
                <View style={styles.header}>
                  {canGoBack ? (
                    <Pressable onPress={back} style={styles.iconBtn} hitSlop={10}>
                      <ArrowLeft size={20} color="#FFFFFF" />
                    </Pressable>
                  ) : (
                    <View style={styles.iconBtnPlaceholder} />
                  )}

                  <View>
                    <Text variant="headlineSmall" style={styles.heroTitle}>
                      Create Trip
                    </Text>
                    <Text style={styles.heroSubtitle}>{headerSubtitle}</Text>
                  </View>
                </View>

                <StepBar index={currentProgressIndex} count={progressCount} />
              </View>
            </View>

            {/* CONTENT */}
            <View style={styles.container}>
              {step === "mode" && (
                <>
                  <TripTypeStep mode={mode} onModeChange={setMode} />
                  <View style={needsExtraBtnGap ? styles.primaryBtnGap : styles.block}>
                    <GradientButton disabled={primaryAction.disabled} onPress={primaryAction.onPress} label={primaryAction.label} />
                  </View>
                </>
              )}

              {step === "type" && (
                <>
                  <TripNameStep
                    tripName={tripName}
                    onTripNameChange={setTripName}
                    startDate={startDate}
                    onStartDateChange={setStartDate}
                    endDate={endDate}
                    onEndDateChange={setEndDate}
                    hasReturn={hasReturn}
                    onHasReturnChange={(v: boolean) => {
                      setHasReturn(v);
                      if (!v) setEndDate("");
                    }}
                    transportModes={transportModes}
                    onTransportModesChange={setTransportModes}
                    tripTypesSelected={tripTypesSelected}
                    onTripTypesSelectedChange={setTripTypesSelected}
                  />

                  <View style={styles.block}>
                    <GradientButton disabled={primaryAction.disabled} onPress={primaryAction.onPress} label={primaryAction.label} />
                  </View>
                </>
              )}

              {step === "items" && (
                <>
                  <BagsAndItemsStep
                    itemPresets={itemPresets}
                    transportModes={transportModes}
                    selectedBags={selectedBags}
                    onSelectedBagsChange={setSelectedBags}
                    tripTypesSelected={tripTypesSelected}
                    mode={mode}
                  />

                  {/* Optional: subtle hint while loading from storage */}
                  {(!presetsHydrated || !bagsHydrated) && (
                    <MotiView
                      from={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "timing", duration: 180 }}
                      style={{ marginTop: 6 }}
                    >
                      <Text style={{ color: "#94A3B8", fontSize: 12 }}>Loading catalog…</Text>
                    </MotiView>
                  )}

                  <View style={styles.block}>
                    <GradientButton disabled={primaryAction.disabled} onPress={primaryAction.onPress} label={primaryAction.label} />
                  </View>
                </>
              )}

              {step === "routineName" && (
                <>
                  <TripNameRoutineStep
                    routineName={routineName}
                    onRoutineNameChange={setRoutineName}
                    routineKinds={routineKinds}
                    onRoutineKindsChange={setRoutineKinds}
                  />
                  <View style={needsExtraBtnGap ? styles.primaryBtnGap : styles.block}>
                    <GradientButton disabled={primaryAction.disabled} onPress={primaryAction.onPress} label={primaryAction.label} />
                  </View>
                </>
              )}

              {step === "routineItems" && (
                <>
                  <StuffSelectRoutineStep
                    items={routineItems}
                    onItemsChange={setRoutineItems}
                    newItemName={routineNewItemName}
                    onNewItemNameChange={setRoutineNewItemName}
                  />
                  <View style={needsExtraBtnGap ? styles.primaryBtnGap : styles.block}>
                    <GradientButton disabled={primaryAction.disabled} onPress={primaryAction.onPress} label={primaryAction.label} />
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          {/* ✅ Confirm Create Trip */}
          <ConfirmCreateTripModal
            visible={confirmCreateOpen}
            title="Create this trip?"
            description={
              tripName.trim()
                ? `"${tripName.trim()}" will be saved with ${selectedBags.length} bag(s).`
                : `This trip will be saved with ${selectedBags.length} bag(s).`
            }
            confirmLabel="Create Trip"
            cancelLabel="Cancel"
            onCancel={() => setConfirmCreateOpen(false)}
            onConfirm={confirmCreateTrip}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B1220" },
  kav: { flex: 1 },
  screen: { flex: 1, backgroundColor: "#0B1220" },
  scrollContent: { paddingBottom: 40 },

  heroContainer: {
    height: 240,
    width: "100%",
    position: "relative",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  heroBackground: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  heroContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    justifyContent: "flex-end",
    paddingBottom: 14,
  },

  header: { flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  iconBtnPlaceholder: { width: 40, height: 40 },

  heroTitle: { color: "#FFFFFF", fontWeight: "800" },
  heroSubtitle: { color: "rgba(255,255,255,0.85)", marginTop: 2 },

  container: {
    paddingHorizontal: 16,
    maxWidth: 420,
    alignSelf: "center",
    width: "100%",
    marginTop: 14,
    paddingBottom: 18,
  },

  block: { marginBottom: 14 },
  primaryBtnGap: { marginTop: 18, marginBottom: 14 },
});