import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  Canvas,
  Circle,
  Group,
  Mask,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function PackingItemAurora({ size = 230 }: { size?: number }) {
  const t1 = useSharedValue(0);
  const t2 = useSharedValue(0);
  const t3 = useSharedValue(0);

  useEffect(() => {
    t1.value = withRepeat(
      withTiming(1, {
        duration: 5200,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    t2.value = withRepeat(
      withTiming(1, {
        duration: 6800,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    t3.value = withRepeat(
      withTiming(1, {
        duration: 6100,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, [t1, t2, t3]);

  const radius = size / 2;
  const move = size * 0.30;

  const r1 = size * 0.9;
  const r2 = size * 0.8;
  const r3 = size * 0.75;

  const transform1 = useDerivedValue(() => [
    { translateX: -move + t1.value * move * 2 },
    { translateY: -move * 0.9 + t1.value * move * 1.8 },
  ]);

  const transform2 = useDerivedValue(() => [
    { translateX: move * 0.95 - t2.value * move * 1.9 },
    { translateY: -move * 0.75 + t2.value * move * 1.5 },
  ]);

  const transform3 = useDerivedValue(() => [
    { translateX: -move * 0.7 + t3.value * move * 1.4 },
    { translateY: move - t3.value * move * 2 },
  ]);

  return (
    <Canvas style={[styles.canvas, { width: size, height: size }]}>
      <Mask
        clip
        mask={<Circle cx={radius} cy={radius} r={radius} color="white" />}
      >
        {/* 🌊 Pohjaväri – tummempi, pehmeä */}
        <Circle cx={radius} cy={radius} r={radius} color="#1c2541" />

        {/* ✨ Blob 1 – light aqua */}
        <Group transform={transform1}>
          <Circle cx={radius} cy={radius} r={r1}>
            <RadialGradient
              c={vec(radius, radius)}
              r={r1}
              colors={[
                "rgba(139, 233, 229, 0.65)",  // soft aqua
                "rgba(139, 233, 229, 0.35)",
                "rgba(139, 233, 229, 0.12)",
                "rgba(139, 233, 229, 0)",
              ]}
              positions={[0, 0.45, 0.75, 1]}
            />
          </Circle>
        </Group>

        {/* ✨ Blob 2 – primary teal */}
        <Group transform={transform2}>
          <Circle cx={radius} cy={radius} r={r2}>
            <RadialGradient
              c={vec(radius, radius)}
              r={r2}
              colors={[
                "rgba(91, 192, 190, 0.55)",  // #5bc0be
                "rgba(91, 192, 190, 0.32)",
                "rgba(91, 192, 190, 0.14)",
                "rgba(91, 192, 190, 0)",
              ]}
              positions={[0, 0.45, 0.75, 1]}
            />
          </Circle>
        </Group>

        {/* ✨ Blob 3 – icy blue */}
        <Group transform={transform3}>
          <Circle cx={radius} cy={radius} r={r3}>
            <RadialGradient
              c={vec(radius, radius)}
              r={r3}
              colors={[
                "rgba(173, 216, 255, 0.45)", // light icy blue
                "rgba(173, 216, 255, 0.26)",
                "rgba(173, 216, 255, 0.1)",
                "rgba(173, 216, 255, 0)",
              ]}
              positions={[0, 0.45, 0.75, 1]}
            />
          </Circle>
        </Group>
      </Mask>
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