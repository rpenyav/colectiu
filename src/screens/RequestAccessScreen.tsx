// src/screens/RequestAccessScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
  ToastAndroid,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppRoutes";
import { useClient } from "../application/context/ClientContext";

type Props = NativeStackScreenProps<RootStackParamList, "RequestAccess">;

const RequestAccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const { dni } = route.params;
  const { requestCreateUserEmail } = useClient();
  const [loading, setLoading] = useState(false);

  const showToast = (msg: string) => {
    if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.LONG);
    else Alert.alert("", msg);
  };

  const onRequest = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await requestCreateUserEmail(dni);
      showToast(
        "Rebràs un correu a l’adreça associada al teu client per continuar el procés."
      );
      // (Opcional) volver a Start o dejar aquí con info
      // navigation.navigate("Start");
    } catch (e: any) {
      const msg =
        e?.raw?.errorString ||
        e?.message ||
        "No s’ha pogut sol·licitar l’accés.";
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Sol·licitar accés</Text>
      <Text style={styles.info}>
        Rebràs un correu a l’adreça associada al teu client per continuar el
        procés.
      </Text>
      <Text style={styles.doc}>Número de document: {dni}</Text>

      <Pressable
        onPress={onRequest}
        disabled={loading}
        style={[styles.btn, loading && { opacity: 0.7 }]}
      >
        <Text style={styles.btnText}>
          {loading ? "Enviant…" : "Sol·licitar accés"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Start")}
        style={styles.link}
      >
        <Text style={styles.linkText}>← Tornar</Text>
      </Pressable>
    </View>
  );
};

export default RequestAccessScreen;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#0B0B0C",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 8 },
  info: { color: "#D1D5DB", textAlign: "center", marginBottom: 8 },
  doc: { color: "#9CA3AF", marginBottom: 24 },
  btn: {
    backgroundColor: "#970c1f",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  btnText: { color: "#fff", fontWeight: "700" },
  link: { marginTop: 16 },
  linkText: { color: "#9CA3AF" },
});
