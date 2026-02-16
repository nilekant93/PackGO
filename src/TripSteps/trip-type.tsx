import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { MotiView } from "moti";
import { CalendarDays, Repeat } from "lucide-react-native";
import type { TripMode } from "../../app/create-trip";

type IconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const options: { value: TripMode; title: string; subtitle: string; Icon: IconType }[] = [
  {
    value: "oneTime",
    title: "One-Time Trip",
    subtitle: "Vacation, business trip, weekend getaway",
    Icon: CalendarDays,
  },
  {
    value: "routine",
    title: "Routine Trip",
    subtitle: "Gym bag, hobby bag, school bag",
    Icon: Repeat,
  },
];

export default function TripTypeStep({
  mode,
  onModeChange,
}: {
  mode: TripMode | null;
  onModeChange: (m: TripMode) => void;
}) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: 18 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 220 }}
    >
      <View style={{ gap: 12 }}>
        {options.map((o) => {
          const selected = mode === o.value;
          return (
            <AnimatedSelectCard
              key={o.value}
              title={o.title}
              subtitle={o.subtitle}
              Icon={o.Icon}
              selected={selected}
              onPress={() => onModeChange(o.value)}
            />
          );
        })}
      </View>
    </MotiView>
  );
}

function AnimatedSelectCard({
  title,
  subtitle,
  Icon,
  selected,
  onPress,
}: {
  title: string;
  subtitle: string;
  Icon: IconType;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { borderColor: selected ? "#22D3EE" : "rgba(148,163,184,0.25)" },
      ]}
    >
      {/* Turkoosi fill (oikealta vasemmalle), ei liikuta sisältöä */}
      <MotiView
        pointerEvents="none"
        style={styles.fillOverlay}
        animate={{ width: selected ? "100%" : "0%" }}
        transition={{ type: "timing", duration: 260 }}
      />

      {/* Sisältö */}
      <View style={styles.content}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        </View>

        {/* Oikea turkoosi alue + ikoni (pysyy aina paikallaan) */}
        <View style={styles.iconPill} pointerEvents="none">
          <Icon size={22} color="#FFFFFF" strokeWidth={2.2} />
        </View>
      </View>
    </Pressable>
  );
}

const RIGHT_PILL_W = 72;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 86,
    borderRadius: 18,
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
    backgroundColor: "rgba(34, 211, 238, 0.28)",
  },

  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
  },

  title: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "800",
  },

  subtitle: {
    color: "#94A3B8",
    marginTop: 4,
    fontSize: 13,
    lineHeight: 17,
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

    primaryButtonWrap: {
    marginTop: 12,      // <-- tästä säädät välin
    marginBottom: 14,
    },


});
