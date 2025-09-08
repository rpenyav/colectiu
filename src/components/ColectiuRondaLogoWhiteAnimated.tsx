import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Platform, Dimensions, Text } from "react-native";
import LottieView from "lottie-react-native";
import animationData from "../../colectiu_ronda_animation.json"; // Ajusta la ruta

type Props = {
  onDone?: () => void;
  width?: number;
  height?: number;
  duration?: number; // ms
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ColectiuRondaLogoWhiteAnimated: React.FC<Props> = ({
  onDone,
  width = 360,
  height = 86, // Adjusted to match SVG aspect ratio (200/20 = 360/36)
  duration = 5200,
}) => {
  const animationRef = useRef<LottieView>(null);

  // Calcular escala para llenar el contenedor manteniendo la proporción
  const lottieCanvasWidth = 420;
  const lottieCanvasHeight = 900;
  const scale =
    Math.min(width / lottieCanvasWidth, height / lottieCanvasHeight) * 9.5; // Increased scale for larger logo
  const scaledWidth = lottieCanvasWidth * scale;
  const scaledHeight = lottieCanvasHeight * scale;
  const translateX = (width - scaledWidth) / 2;
  const translateY = (height - scaledHeight) / 2;

  useEffect(() => {
    console.log("Lottie component mounted, animationData:", !!animationData);
    console.log("Scaled dimensions:", {
      scaledWidth,
      scaledHeight,
      translateX,
      translateY,
    });
    animationRef.current?.play();

    const timeout = setTimeout(() => {
      console.log("Lottie animation done, calling onDone");
      onDone?.();
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, onDone]);

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { width, height }]}>
        <Text style={styles.fallbackText}>Lottie not supported on web</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <LottieView
        ref={animationRef}
        source={animationData}
        style={{
          width: scaledWidth,
          height: scaledHeight,
          transform: [{ translateX }, { translateY }],
        }}
        loop={false}
        onAnimationFinish={() => {
          console.log("Lottie animation finished");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    backgroundColor: "#970c1f",
    borderRadius: 16,
    overflow: "hidden",
  },
  fallbackText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    marginTop: "50%",
  },
});

export default ColectiuRondaLogoWhiteAnimated;
