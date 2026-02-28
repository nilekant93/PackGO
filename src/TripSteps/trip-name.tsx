import {
  Backpack,
  Bike,
  Briefcase,
  Building2,
  Bus,
  Calendar,
  Car,
  CircleHelp,
  Clock,
  Footprints,
  Palmtree,
  Plane,
  Ship,
  Tent,
  Train,
} from "lucide-react-native";
import { MotiView } from "moti";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Switch, Text, TextInput } from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";

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

type Props = {
  tripName: string;
  onTripNameChange: (v: string) => void;

  startDate: string; // ISO string
  onStartDateChange: (v: string) => void;

  endDate: string; // ISO string or ""
  onEndDateChange: (v: string) => void;

  hasReturn: boolean;
  onHasReturnChange: (v: boolean) => void;

  transportModes: string[];
  onTransportModesChange: (v: string[]) => void;

  tripTypesSelected: string[];
  onTripTypesSelectedChange: (v: string[]) => void;
};

export default function TripNameStep({
  tripName,
  onTripNameChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  hasReturn,
  onHasReturnChange,
  transportModes,
  onTransportModesChange,
  tripTypesSelected,
  onTripTypesSelectedChange,
}: Props) {
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [startTimePickerOpen, setStartTimePickerOpen] = useState(false);
  const [endTimePickerOpen, setEndTimePickerOpen] = useState(false);

  const toggle = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];

  // --- Helpers: show date & time from ISO ---
  const extractDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    // fi-FI gives dd.mm.yyyy
    return d.toLocaleDateString("fi-FI");
  };

  const extractTime = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" });
  };

  // --- Merge pickers with existing datetime ---
  const getDateOrNow = (iso: string) => (iso ? new Date(iso) : new Date());

  const mergeDate = (existingISO: string, pickedDate: Date) => {
    const existing = getDateOrNow(existingISO);
    const d = new Date(pickedDate);
    d.setHours(existing.getHours(), existing.getMinutes(), 0, 0);
    return d.toISOString();
  };

  const mergeTime = (existingISO: string, hours: number, minutes: number) => {
    const existing = getDateOrNow(existingISO);
    const d = new Date(existing);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  // These Date objects feed the modals
  const startDateObj = useMemo(() => (startDate ? new Date(startDate) : new Date()), [startDate]);
  const endDateObj = useMemo(() => {
    if (endDate) return new Date(endDate);
    if (startDate) return new Date(startDate);
    return new Date();
  }, [endDate, startDate]);

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

      {/* Dates & Times */}
      <View style={styles.block}>
        <View style={styles.datesHeaderRow}>
          <Text style={styles.label}>Trip Dates & Times</Text>

          <View style={styles.returnToggleRow}>
            <Text style={styles.returnToggleText}>Return</Text>
            <Switch
              value={hasReturn}
              onValueChange={(v) => {
                onHasReturnChange(v);
                if (!v) onEndDateChange("");
              }}
            />
          </View>
        </View>

        {/* Start row */}
        <View style={styles.dateTimeRow}>
          <Pressable onPress={() => setStartDatePickerOpen(true)} style={[styles.dateTimeField, { flex: 1 }]}>
            <Calendar size={18} color="#22D3EE" />
            <Text style={styles.dateTimeLabel}>Start Date</Text>
            <Text style={styles.dateTimeValue}>{extractDate(startDate) || "Select date"}</Text>
          </Pressable>

          <Pressable
            onPress={() => setStartTimePickerOpen(true)}
            style={[styles.dateTimeField, { marginLeft: 10, flex: 1 }]}
          >
            <Clock size={18} color="#22D3EE" />
            <Text style={styles.dateTimeLabel}>Start Time</Text>
            <Text style={styles.dateTimeValue}>{extractTime(startDate) || "Select time"}</Text>
          </Pressable>
        </View>

        {/* End row (optional) */}
        {hasReturn && (
          <View style={[styles.dateTimeRow, { marginTop: 12 }]}>
            <Pressable onPress={() => setEndDatePickerOpen(true)} style={[styles.dateTimeField, { flex: 1 }]}>
              <Calendar size={18} color="#22D3EE" />
              <Text style={styles.dateTimeLabel}>End Date</Text>
              <Text style={styles.dateTimeValue}>{extractDate(endDate) || "Select date"}</Text>
            </Pressable>

            <Pressable
              onPress={() => setEndTimePickerOpen(true)}
              style={[styles.dateTimeField, { marginLeft: 10, flex: 1 }]}
            >
              <Clock size={18} color="#22D3EE" />
              <Text style={styles.dateTimeLabel}>End Time</Text>
              <Text style={styles.dateTimeValue}>{extractTime(endDate) || "Select time"}</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Pickers */}
      <DatePickerModal
        locale="fi"
        mode="single"
        visible={startDatePickerOpen}
        date={startDateObj}
        onDismiss={() => setStartDatePickerOpen(false)}
        onConfirm={({ date }) => {
          if (!date) return;
          onStartDateChange(mergeDate(startDate, date));
          setStartDatePickerOpen(false);
        }}
      />

      <TimePickerModal
        locale="fi"
        visible={startTimePickerOpen}
        onDismiss={() => setStartTimePickerOpen(false)}
        onConfirm={({ hours, minutes }) => {
          onStartDateChange(mergeTime(startDate, hours, minutes));
          setStartTimePickerOpen(false);
        }}
      />

      {hasReturn && (
        <>
          <DatePickerModal
            locale="fi"
            mode="single"
            visible={endDatePickerOpen}
            date={endDateObj}
            onDismiss={() => setEndDatePickerOpen(false)}
            onConfirm={({ date }) => {
              if (!date) return;
              // if endDate empty, use startDate as base time; else keep end time
              onEndDateChange(mergeDate(endDate || startDate, date));
              setEndDatePickerOpen(false);
            }}
          />

          <TimePickerModal
            locale="fi"
            visible={endTimePickerOpen}
            onDismiss={() => setEndTimePickerOpen(false)}
            onConfirm={({ hours, minutes }) => {
              onEndDateChange(mergeTime(endDate || startDate, hours, minutes));
              setEndTimePickerOpen(false);
            }}
          />
        </>
      )}

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
          <Icon size={20} color={"#ffffff"} strokeWidth={1.4} />
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

  datesHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  returnToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  returnToggleText: {
    color: "#94A3B8",
    fontSize: 12,
    marginRight: 8,
  },

  dateTimeRow: {
    flexDirection: "row",
    gap: 10,
  },

  dateTimeField: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(148,163,184,0.25)",
    backgroundColor: "rgba(148,163,184,0.06)",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  dateTimeLabel: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 6,
    marginBottom: 2,
  },

  dateTimeValue: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
  },

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