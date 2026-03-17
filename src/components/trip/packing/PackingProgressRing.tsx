import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Canvas, Group, Path, Skia } from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function PackingProgressRing({
  size,
  progress,
  strokeWidth = 8,
}: {
  size: number;
  progress: number; // 0..1
  strokeWidth?: number;
}) {
  const clamped = Math.max(0, Math.min(1, progress));
  const animatedProgress = useSharedValue(clamped);

  useEffect(() => {
    animatedProgress.value = withTiming(clamped, {
      duration: 500,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [clamped, animatedProgress]);

  const center = size / 2;
  const radius = center - strokeWidth / 2;

  const circlePath = useMemo(() => {
    const p = Skia.Path.Make();
    p.addCircle(center, center, radius);
    return p;
  }, [center, radius]);

  const end = useDerivedValue(() => animatedProgress.value);

  return (
    <Canvas style={[styles.canvas, { width: size, height: size }]}>
      <Group
        origin={{ x: center, y: center }}
        transform={[{ rotate: -Math.PI / 2 }]}
      >
        <Path
          path={circlePath}
          color="rgba(255, 255, 255, 0.09)"
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
        />
        <Path
          path={circlePath}
          color="#FFFFFF"
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
          start={0}
          end={end}
        />
      </Group>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});