// src/screens/DashboardScreen.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppRoutes";
import { useAuth } from "../application/context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

const BRAND = "#970c1f";

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { token, signOut } = useAuth();

  const onLogout = async () => {
    signOut();
    navigation.replace("Start");
  };

  const tokenPreview =
    token && token.length > 16
      ? `${token.slice(0, 8)}…${token.slice(-6)}`
      : token || "—";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Sesión activa</Text>
      <Text style={styles.token}>Token: {tokenPreview}</Text>

      <Pressable style={styles.btn} onPress={onLogout}>
        <Text style={styles.btnText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0C",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { color: "#fff", fontWeight: "800", fontSize: 26, marginBottom: 6 },
  subtitle: { color: "#D1D5DB", marginBottom: 16 },
  token: { color: "#9CA3AF", marginBottom: 28, textAlign: "center" },
  btn: {
    backgroundColor: BRAND,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
