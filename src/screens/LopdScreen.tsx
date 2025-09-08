// src/screens/LopdScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppRoutes";

type Props = NativeStackScreenProps<RootStackParamList, "Lopd">;

const BRAND = "#970c1f";

const LopdScreen: React.FC<Props> = ({ route, navigation }) => {
  const { dni, redirectTo = "Login" } = route.params;
  const [loading, setLoading] = useState(false);

  const onAccept = async () => {
    setLoading(true);
    try {
      // TODO: Llama a tu endpoint de aceptación LOPD
      // await lopdService.accept({ dni });

      // Tras aceptar LOPD, redirigimos donde corresponda (por defecto a Login)
      navigation.replace(
        redirectTo as any,
        redirectTo === "Login" ? { dni } : undefined
      );
    } catch (e) {
      // TODO: muestra error si fallase
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Política de Protección de Datos</Text>
        <Text style={styles.paragraph}>
          (Aquí va el texto legal que el usuario debe aceptar para continuar).
        </Text>

        <Pressable
          onPress={onAccept}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.9 },
            loading && { opacity: 0.7 },
          ]}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Aceptar y continuar</Text>
          )}
        </Pressable>

        <Text style={styles.helper}>DNI/NIE: {dni}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0B0C" },
  content: {
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 24,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },
  title: { color: "#fff", fontWeight: "800", fontSize: 22, marginBottom: 12 },
  paragraph: { color: "#e5e7eb", lineHeight: 20, marginBottom: 24 },
  button: {
    height: 54,
    borderRadius: 12,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  helper: { color: "#9CA3AF", marginTop: 12 },
});

export default LopdScreen;
