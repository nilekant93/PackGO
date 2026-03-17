import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { MotiView } from "moti";
import { getBagImageSrc, type BagImageId } from "../../bags/types";

export type PackingBagChipItem = {
  id: string;
  name: string;
  imageId?: string;
};

export default function PackingBagChip({
  bag,
  active,
  onPress,
}: {
  bag: PackingBagChipItem;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <MotiView
        animate={{
          scale: active ? 1 : 0.96,
        }}
        transition={{ type: "timing", duration: 180 }}
        style={styles.outerWrap}
      >
        <MotiView
          animate={{
            borderColor: active ? "#22D3EE" : "rgba(148,163,184,0.18)",
            backgroundColor: active ? "rgba(34,211,238,0.12)" : "rgba(148,163,184,0.08)",
          }}
          transition={{ type: "timing", duration: 180 }}
          style={styles.circleOuter}
        >
          <View style={styles.circleInner}>
            <Image
              source={getBagImageSrc((bag.imageId ?? "suitcase") as BagImageId)}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </MotiView>
      </MotiView>

      <Text numberOfLines={1} style={[styles.label, active && styles.labelActive]}>
        {bag.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 88,
    alignItems: "center",
  },

  outerWrap: {
    width: 74,
    height: 74,
    alignItems: "center",
    justifyContent: "center",
  },

  circleOuter: {
    width: 72,
    height: 72,
    borderRadius: 999,
    padding: 3,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  circleInner: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(148, 163, 184, 0)",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  label: {
    marginTop: 8,
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "700",
    textAlign: "center",
    width: "100%",
  },

  labelActive: {
    color: "#E2E8F0",
    fontWeight: "900",
  },
});