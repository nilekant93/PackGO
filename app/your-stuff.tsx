import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Image,
} from "react-native";
import { Text } from "react-native-paper";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";

import BagsOrItemsStep from "../src/catalogueSteps/bags-or-items";
import BagsStep from "../src/catalogueSteps/bags";
import ItemsStep from "../src/catalogueSteps/items";

type CatalogueStep = "pick" | "bags" | "items";

// ✅ Vaihda tähän sun hero-kuva
const HERO = require("../assets/your-stuff-hero.png");
// esim jos teet oman:
// const HERO = require("../assets/your-stuff-hero.png");

export default function YourStuff() {
  const [step, setStep] = useState<CatalogueStep>("pick");

  const subtitle =
    step === "pick"
      ? "Choose what you want to manage"
      : step === "bags"
      ? "Manage your bags"
      : "Manage your items & presets";

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
            <View style={styles.hero}>
              <Image source={HERO} style={styles.heroImage} resizeMode="cover" />

              {/* Tummentava häivytys alareunaan */}
              <LinearGradient
                colors={["rgba(11,18,32,0)", "rgba(11,18,32,0.75)", "rgba(11,18,32,1)"]}
                style={styles.heroFade}
              />

              {/* Otsikko + subtitle hero:n päällä */}
              <View style={styles.heroHeader}>
                <Text variant="headlineSmall" style={styles.title}>
                  Your Stuff
                </Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
            </View>

            {/* CONTENT */}
            <View style={styles.container}>
              <MotiView
                from={{ opacity: 0, translateX: 14 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 220 }}
              >
                {step === "pick" && (
                  <BagsOrItemsStep onPickBags={() => setStep("bags")} onPickItems={() => setStep("items")} />
                )}

                {step === "bags" && <BagsStep onBack={() => setStep("pick")} />}

                {step === "items" && <ItemsStep onBack={() => setStep("pick")} />}
              </MotiView>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const HERO_HEIGHT = 280;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B1220" },
  kav: { flex: 1 },
  screen: { flex: 1, backgroundColor: "#0B1220" },

  scrollContent: {
    paddingBottom: 40,
  },

  hero: {
    height: HERO_HEIGHT,
    position: "relative",
    backgroundColor: "#0B1220",
    overflow: "hidden",
  },

    heroImage: {
    width: "100%",
    height: "100%",
  },


  heroFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },

  heroHeader: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
  },

  title: { color: "#E2E8F0", fontWeight: "800" },
  subtitle: { color: "#94A3B8", marginTop: 4 },

  container: {
    paddingHorizontal: 16,
    paddingTop: 18,
    maxWidth: 420,
    alignSelf: "center",
    width: "100%",
  },
});
