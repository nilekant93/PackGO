import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "react-native-paper";
import { Backpack, PackageOpen } from "lucide-react-native";
import { MotiView } from "moti";

type IconType = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

export default function BagsOrItemsStep({
  onPickBags,
  onPickItems,
}: {
  onPickBags: () => void;
  onPickItems: () => void;
}) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: 18 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 220 }}
      style={{ gap: 14 }}
    >
      <View style={styles.grid}>
        <AnimatedCard delay={0}>
          <BigCard title="Bags" Icon={Backpack} onPress={onPickBags} />
        </AnimatedCard>

        <AnimatedCard delay={70}>
          <BigCard title="Items" Icon={PackageOpen} onPress={onPickItems} />
        </AnimatedCard>
      </View>
    </MotiView>
  );
}

function AnimatedCard({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10, scale: 0.98 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: "timing", duration: 240, delay }}
      style={{ width: "48%" }}
    >
      {children}
    </MotiView>
  );
}

function BigCard({
  title,
  Icon,
  onPress,
}: {
  title: string;
  Icon: IconType;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <View style={styles.content}>
        <Icon size={46} color="#ffffff" strokeWidth={1.4} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  card: {
    width: "100%", // tärkeä: wrapper hoitaa 48%
    height: 170,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(148,163,184,0.25)",
    backgroundColor: "rgba(148,163,184,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  cardTitle: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "900",
  },
});
