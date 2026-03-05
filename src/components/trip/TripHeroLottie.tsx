import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

export default function TripHeroLottie() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LottieView
        source={require("../../../assets/animations/trip-hero.json")}
        autoPlay
        loop
        style={styles.lottie}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
});