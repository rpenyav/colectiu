// src/screens/SplashScreen.tsx
import React, { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppRoutes";

// Asegúrate de exportar estos dos desde tu carpeta de componentes
import {
  ColectiuRondaLogoWhiteAnimated,
  ColectiuRondaLogWhite,
} from "../components";

type Nav = NativeStackNavigationProp<RootStackParamList, "Splash">;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  // Fallback simple para Web: mostramos el logo y navegamos tras un delay
  useEffect(() => {
    if (Platform.OS === "web") {
      const id = setTimeout(() => navigation.replace("Start"), 1200);
      return () => clearTimeout(id);
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        // Versión Web (sin Skia)
        <View style={styles.logoWebWrapper}>
          <ColectiuRondaLogWhite width={360} />
        </View>
      ) : (
        // Versión Nativa (Skia)
        <ColectiuRondaLogoWhiteAnimated
          width={360}
          height={180}
          duration={1400}
          onDone={() => navigation.replace("Start")}
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
  // Por si quieres margen/centrado específico en web
  logoWebWrapper: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#970c1f",
  },
});

export default SplashScreen;
