import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { MotiView } from "moti";
import {
  Plane,
  Train,
  Car,
  Bus,
  Ship,
  Bike,
  Footprints,
  CircleHelp,
  Palmtree,
  Briefcase,
  Backpack,
  Tent,
  Building2,
} from "lucide-react-native";

type IconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const transportOptions: { value: string; icon: IconType }[] = [
  { value: "Plane", icon: Plane },
  { value: "Train", icon: Train },
  { value: "Car", icon: Car },
  { value: "Bus", icon: Bus },
  { value: "Ferry", icon: Ship },
  { value: "Bike", icon: Bike },
  { value: "Walking", icon: Footprints },
  { value: "Other", icon: CircleHelp },
];

const tripTypeOptions: { value: string; icon: IconType }[] = [
  { value: "Holiday Trip", icon: Palmtree },
  { value: "Work Trip", icon: Briefcase },
  { value: "Weekend Trip", icon: Backpack },
  { value: "Camping Trip", icon: Tent },
  { value: "City Break", icon: Building2 },
];

export default function TripNameStep({
  tripName,
  onTripNameChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  transportModes,
  onTransportModesChange,
  tripTypesSelected,
  onTripTypesSelectedChange,
}: any) {
  const toggle = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];

  return (
    <MotiView
      from={{ opacity: 0, translateX: 18 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 220 }}
    >
      {/* Trip Name */}
      <View style={styles.block}>
        <Text style={styles.label}>Trip Name</Text>
        <TextInput
          mode="outlined"
          value={tripName}
          onChangeText={onTripNameChange}
          placeholder="e.g., Summer Vacation 2026"
          outlineColor="rgba(148,163,184,0.25)"
          activeOutlineColor="#22D3EE"
          style={styles.input}
          textColor="#E2E8F0"
          placeholderTextColor="#64748B"
          theme={{ roundness: 14 }}
        />
      </View>

      {/* Transport */}
      <View style={styles.block}>
        <Text style={styles.label}>Transport</Text>

        <View style={styles.grid}>
          {transportOptions.map((t) => {
            const selected = transportModes.includes(t.value);
            return (
              <AnimatedSelectCard
                key={t.value}
                label={t.value}
                Icon={t.icon}
                selected={selected}
                onPress={() => onTransportModesChange(toggle(transportModes, t.value))}
              />
            );
          })}
        </View>

        <Text style={styles.helper}>Select one or more</Text>
      </View>

      {/* Trip Type */}
      <View style={styles.block}>
        <Text style={styles.label}>Trip Type</Text>

        <View style={styles.grid}>
          {tripTypeOptions.map((t) => {
            const selected = tripTypesSelected.includes(t.value);
            return (
              <AnimatedSelectCard
                key={t.value}
                label={t.value}
                Icon={t.icon}
                selected={selected}
                onPress={() => onTripTypesSelectedChange(toggle(tripTypesSelected, t.value))}
              />
            );
          })}
        </View>

        <Text style={styles.helper}>Select one or more</Text>
      </View>
    </MotiView>
  );
}

function AnimatedSelectCard({
  label,
  Icon,
  selected,
  onPress,
}: {
  label: string;
  Icon: IconType;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pickCard,
        { borderColor: selected ? "#22D3EE" : "rgba(148,163,184,0.25)" },
      ]}
    >
      {/* Turkoosi fill-animaatio */}
      <MotiView
        pointerEvents="none"
        style={styles.fillOverlay}
        animate={{ width: selected ? "100%" : "0%" }}
        transition={{ type: "timing", duration: 260 }}
      />

      {/* Content */}
      <View style={styles.pickContent}>
        <Text style={styles.pickLabel} numberOfLines={1}>
          {label}
        </Text>

        <View style={styles.iconPill} pointerEvents="none">
          <Icon
            size={20}
            color={selected ? "#ffffff" : "#ffffff"}
            strokeWidth={1.4}
          />
        </View>
      </View>
    </Pressable>
  );
}

const RIGHT_PILL_W = 64;

const styles = StyleSheet.create({
  block: { marginBottom: 14 },

  label: { color: "#CBD5E1", marginBottom: 8 },
  helper: { color: "#94A3B8", marginTop: 8, fontSize: 12 },

  input: { backgroundColor: "rgba(148,163,184,0.06)" },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  pickCard: {
    width: "48%",
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(148,163,184,0.08)",
  },

  fillOverlay: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(34, 211, 238, 0.33)",
  },

  pickContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
  },

  pickLabel: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "800",
    flexShrink: 1,
    paddingRight: 10,
  },

  iconPill: {
    width: RIGHT_PILL_W,
    height: "100%",
    marginLeft: "auto",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(34, 211, 238, 0.33)",
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
  },
});
