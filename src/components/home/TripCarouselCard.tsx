import { LinearGradient } from "expo-linear-gradient";
import { Luggage } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import type { Trip } from "../../storage/trips";

function getCountdownParts(targetISO: string) {
  const target = new Date(targetISO).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, target - now);

  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const remAfterDays = totalSeconds % 86400;

  const hours = Math.floor(remAfterDays / 3600);
  const remAfterHours = remAfterDays % 3600;

  const minutes = Math.floor(remAfterHours / 60);
  const seconds = remAfterHours % 60;

  return { days, hours, minutes, seconds };
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function TripCarouselCard({
  trip,
  width,
  onPress,
}: {
  trip: Trip;
  width: number;
  onPress: () => void;
}) {
  const meta = useMemo(() => {
    if (trip.mode !== "oneTime") return { line1: "Routine", line2: "" };

    const bags = `${trip.bags.length} bag${trip.bags.length === 1 ? "" : "s"}`;
    const transport = trip.transportModes?.length ? trip.transportModes.join(", ") : "—";
    const types = trip.tripTypesSelected?.length ? trip.tripTypesSelected.join(", ") : "—";

    return {
      line1: `${bags} • ${transport}`,
      line2: types,
    };
  }, [trip]);

  const [countdown, setCountdown] = useState(() => {
    if (trip.mode !== "oneTime") return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return getCountdownParts(trip.startDateISO);
  });

  useEffect(() => {
    if (trip.mode !== "oneTime") return;

    const id = setInterval(() => {
      setCountdown(getCountdownParts(trip.startDateISO));
    }, 1000);

    return () => clearInterval(id);
  }, [trip]);

  const countdownText =
    trip.mode === "oneTime"
      ? `${countdown.days}d ${pad2(countdown.hours)}h ${pad2(
          countdown.minutes
        )}m ${pad2(countdown.seconds)}s`
      : "—";

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { width }]}
      android_ripple={{ color: "rgba(34,211,238,0.15)" }}
    >
      <LinearGradient
        colors={[
          "rgba(34,211,238,0.18)",
          "rgba(148,163,184,0.06)",
          "rgba(148,163,184,0.08)",
        ]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {trip.name}
        </Text>

        <View style={styles.pill}>
          <Luggage size={16} color="#FFFFFF" />
          <Text style={styles.pillText}>
            {trip.mode === "oneTime" ? "Trip" : "Routine"}
          </Text>
        </View>
      </View>

      {/* 🔥 Countdown – isompi fontti, vasemmalla, ilman taustaa */}
      <View style={styles.countdownRow}>
        <Text style={styles.countdownValue}>{countdownText}</Text>
      </View>

      <Text style={styles.meta1} numberOfLines={1}>
        {meta.line1}
      </Text>
      <Text style={styles.meta2} numberOfLines={2}>
        {meta.line2}
      </Text>

      <View style={styles.footerHint}>
        <Text style={styles.hintText}>Open checklist →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 176,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    backgroundColor: "rgba(148,163,184,0.08)",
    padding: 16,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  title: {
    flex: 1,
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "900",
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 999,
    backgroundColor: "rgba(34,211,238,0.22)",
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.25)",
  },

  pillText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },

  countdownRow: {
    marginTop: 12,
    alignItems: "flex-start",
  },

  countdownValue: {
    color: "#22D3EE",
    fontSize: 20, // 🔥 selvästi isompi
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  meta1: {
    color: "#94A3B8",
    marginTop: 10,
    fontSize: 12,
  },

  meta2: {
    color: "rgba(148,163,184,0.9)",
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
  },

  footerHint: {
    marginTop: "auto",
    paddingTop: 10,
  },

  hintText: {
    color: "#22D3EE",
    fontWeight: "800",
    fontSize: 12,
  },
});