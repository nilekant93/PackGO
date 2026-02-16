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

import TripTypeStep from "../src/TripSteps/trip-type";
import TripNameStep from "../src/TripSteps/trip-name";
import BagSelectStep from "../src/TripSteps/bag-select";
import StuffSelectStep from "../src/TripSteps/stuff-select";

import TripNameRoutineStep from "../src/TripSteps/trip-name-routine";
import StuffSelectRoutineStep from "../src/TripSteps/stuff-select-routine";

import StepBar from "../src/TripSteps/step-bar";
import GradientButton from "../src/TripSteps/gradient-button";

export type TripMode = "oneTime" | "routine";
export type Step =
  | "mode" // choose one-time vs routine
  | "type" // regular: details
  | "bags"
  | "items"
  | "routineName"
  | "routineItems";

export type Bag = { id: string; name: string; type: string };
export type Item = { id: string; name: string; checked: boolean };
export type Preset = { id: string; name: string; items: string[] };

const heroImage = require("../assets/create-trip-hero.png");

export default function CreateTrip() {
  const router = useRouter();

  // Mock data
  const bags: Bag[] = useMemo(
    () => [
      { id: "1", name: "Carry-on", type: "Cabin bag" },
      { id: "2", name: "Backpack", type: "Day bag" },
      { id: "3", name: "Suitcase", type: "Checked luggage" },
    ],
    []
  );

  const itemPresets: Preset[] = useMemo(
    () => [
      { id: "p1", name: "Toiletries", items: ["Toothbrush", "Toothpaste", "Deodorant"] },
      { id: "p2", name: "Clothes", items: ["T-shirts", "Socks", "Underwear"] },
      { id: "p3", name: "Tech", items: ["Charger", "Power bank", "Headphones"] },
    ],
    []
  );

  // Wizard control
  const [step, setStep] = useState<Step>("mode");
  const [mode, setMode] = useState<TripMode | null>(null);

  // Regular (one-time) state
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transportModes, setTransportModes] = useState<string[]>([]);
  const [tripTypesSelected, setTripTypesSelected] = useState<string[]>([]);
  const [selectedBags, setSelectedBags] = useState<Bag[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");

  // Routine state
  const [routineName, setRoutineName] = useState("");
  const [routineKinds, setRoutineKinds] = useState<string[]>([]);
  const [routineItems, setRoutineItems] = useState<Item[]>([]);
  const [routineNewItemName, setRoutineNewItemName] = useState("");

  // Progress steps (dynamic)
  const stepsForProgress: Step[] =
    mode === "routine" ? ["mode", "routineName", "routineItems"] : ["mode", "type", "bags", "items"];

  const currentProgressIndex = Math.max(0, stepsForProgress.indexOf(step));
  const progressCount = stepsForProgress.length;

  const headerSubtitle = (() => {
    switch (step) {
      case "mode":
        return "Choose trip creation mode";
      case "type":
        return "One-time trip details";
      case "bags":
        return "Select your bags";
      case "items":
        return "Add items to pack";
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

    // regular
    if (step === "type") {
      setStep("mode");
      setMode(null);
    } else if (step === "bags") {
      setStep("type");
    } else if (step === "items") {
      setStep("bags");
    }
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

    // regular
    if (step === "type") {
      const ok = tripName.trim() && transportModes.length > 0 && tripTypesSelected.length > 0;
      if (ok) setStep("bags");
      return;
    }
    if (step === "bags") {
      setStep("items");
      return;
    }
  };

  const createTrip = () => {
    if (!tripName.trim() || transportModes.length === 0 || tripTypesSelected.length === 0 || items.length === 0) return;
    router.replace("/01-Index");
  };

  const createRoutine = () => {
    if (!routineName.trim() || routineItems.length === 0) return;
    router.replace("/01-Index");
  };

  // Primary button config
  const primaryAction = (() => {
    if (step === "mode") {
      return { label: "Continue", disabled: !mode, onPress: next };
    }

    if (mode === "routine") {
      if (step === "routineName") {
        return { label: "Continue to Items", disabled: !routineName.trim(), onPress: next };
      }
      if (step === "routineItems") {
        return { label: "Create Routine", disabled: routineItems.length === 0, onPress: createRoutine };
      }
    }

    // regular
    if (step === "type") {
      return {
        label: "Continue to Bags",
        disabled: !tripName.trim() || transportModes.length === 0 || tripTypesSelected.length === 0,
        onPress: next,
      };
    }
    if (step === "bags") {
      return { label: "Continue to Items", disabled: false, onPress: next };
    }
    if (step === "items") {
      return { label: "Create Trip", disabled: items.length === 0, onPress: createTrip };
    }

    return { label: "Continue", disabled: false, onPress: next };
  })();

  // Only these needed extra top-gap (the ones you mentioned):
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
                colors={[
                  "rgba(0,0,0,0.08)",
                  "rgba(0,0,0,0.25)",
                  "rgba(11,18,32,0.85)",
                  "#0B1220",
                ]}
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
                    <GradientButton
                      disabled={primaryAction.disabled}
                      onPress={primaryAction.onPress}
                      label={primaryAction.label}
                    />
                  </View>
                </>
              )}

              {/* REGULAR FLOW */}
              {step === "type" && (
                <>
                  <TripNameStep
                    tripName={tripName}
                    onTripNameChange={setTripName}
                    startDate={startDate}
                    onStartDateChange={setStartDate}
                    endDate={endDate}
                    onEndDateChange={setEndDate}
                    transportModes={transportModes}
                    onTransportModesChange={setTransportModes}
                    tripTypesSelected={tripTypesSelected}
                    onTripTypesSelectedChange={setTripTypesSelected}
                  />
                  <View style={styles.block}>
                    <GradientButton
                      disabled={primaryAction.disabled}
                      onPress={primaryAction.onPress}
                      label={primaryAction.label}
                    />
                  </View>
                </>
              )}

              {step === "bags" && (
                <>
                  <BagSelectStep bags={bags} selectedBags={selectedBags} onSelectedBagsChange={setSelectedBags} />
                  <View style={styles.block}>
                    <GradientButton
                      disabled={primaryAction.disabled}
                      onPress={primaryAction.onPress}
                      label={primaryAction.label}
                    />
                  </View>
                </>
              )}

              {step === "items" && (
                <>
                  <StuffSelectStep
                    itemPresets={itemPresets}
                    items={items}
                    onItemsChange={setItems}
                    newItemName={newItemName}
                    onNewItemNameChange={setNewItemName}
                  />
                  <View style={styles.block}>
                    <GradientButton
                      disabled={primaryAction.disabled}
                      onPress={primaryAction.onPress}
                      label={primaryAction.label}
                    />
                  </View>
                </>
              )}

              {/* ROUTINE FLOW */}
              {step === "routineName" && (
                <>
                  <TripNameRoutineStep
                    routineName={routineName}
                    onRoutineNameChange={setRoutineName}
                    routineKinds={routineKinds}
                    onRoutineKindsChange={setRoutineKinds}
                  />
                  <View style={needsExtraBtnGap ? styles.primaryBtnGap : styles.block}>
                    <GradientButton
                      disabled={primaryAction.disabled}
                      onPress={primaryAction.onPress}
                      label={primaryAction.label}
                    />
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
                    <GradientButton
                      disabled={primaryAction.disabled}
                      onPress={primaryAction.onPress}
                      label={primaryAction.label}
                    />
                  </View>
                </>
              )}
            </View>
          </ScrollView>
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

  heroBackground: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

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

  // regular wrapper
  block: { marginBottom: 14 },

  // extra top gap for: mode + routine flow buttons
  primaryBtnGap: {
    marginTop: 18,
    marginBottom: 14,
  },
});
