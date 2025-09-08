// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Platform, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppRoutes";
import {
  ColectiuRondaLogoWhiteAnimated,
  // ColectiuRondaLogWhite,
} from "../components";
import { useAuth } from "../application/context/AuthContext";

type Nav = NativeStackNavigationProp<RootStackParamList, "Splash">;

const MIN_SPLASH_MS = 3000;
const NATIVE_ANIM_DURATION_MS = 1200;
const WEB_FADE_MS = 200;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const mountedAtRef = useRef<number>(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { hydrated, isAuthenticated } = useAuth();

  const navigateWhenReady = (alreadyElapsed?: number) => {
    const started = mountedAtRef.current;
    const elapsed = alreadyElapsed ?? Date.now() - started;
    const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);
    const extra = Platform.OS === "web" ? WEB_FADE_MS : 0;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const dest: keyof RootStackParamList = isAuthenticated
        ? "Dashboard"
        : "Start";
      navigation.replace(dest);
    }, remaining + extra);
  };

  useEffect(() => {
    // En web no hay animación nativa, disparamos cuando esté hidratado
    if (Platform.OS === "web" && hydrated) {
      navigateWhenReady();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [navigation, hydrated]);

  const handleNativeDone = () => {
    // Al terminar animación nativa, navegamos respetando MIN_SPLASH_MS
    const elapsed = Date.now() - mountedAtRef.current;
    // Si aún no se hidrató, esperamos a que hydrated sea true y esta función no rompe
    if (!hydrated) {
      // reintento mínimo: en cuanto se hidrate, el useEffect de arriba hará navigateWhenReady()
      const extraWait = setInterval(() => {
        if (hydrated) {
          clearInterval(extraWait);
          navigateWhenReady(elapsed);
        }
      }, 50);
      return;
    }
    navigateWhenReady(elapsed);
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <View style={styles.logoWebWrapper}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>J2</Text>
        </View>
      ) : (
        <ColectiuRondaLogoWhiteAnimated
          duration={NATIVE_ANIM_DURATION_MS}
          onDone={handleNativeDone}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#970c1f",
    alignItems: "center",
    justifyContent: "center",
  },
  logoWebWrapper: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#970c1f",
  },
});

export default SplashScreen;
