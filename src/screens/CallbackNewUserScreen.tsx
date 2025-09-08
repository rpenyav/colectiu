// src/screens/CallbackNewUserScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppRoutes";
import { useClient } from "../application/context/ClientContext";

type Props = NativeStackScreenProps<RootStackParamList, "CallbackNewUser">;

/**
 * Espera params: { lang?: string; token: string }
 * (si no vienen por params, también podrías parsear desde Linking.getInitialURL()).
 */
const CallbackNewUserScreen: React.FC<Props> = ({ route, navigation }) => {
  const { token } = route.params;
  const { prefillFromCallback } = useClient();
  const [loading, setLoading] = useState(true);

  const showToast = (msg: string) => {
    if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.LONG);
    else Alert.alert("", msg);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { prefill, hasLopdAlready } = await prefillFromCallback(token);
        if (!mounted) return;
        navigation.replace("CreateUser", {
          dni: prefill.nif,
          prefill,
          mode: "createUserOnly",
          hasLopdAlready,
        });
      } catch (e: any) {
        const msg =
          e?.raw?.errorString ||
          e?.message ||
          "No s’han pogut recuperar les dades.";
        showToast(msg);
        navigation.replace("Start");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token, navigation, prefillFromCallback]);

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#970c1f" />
      <Text style={styles.text}>Carregant dades…</Text>
    </View>
  );
};

export default CallbackNewUserScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B0B0C",
  },
  text: { marginTop: 12, color: "#D1D5DB" },
});
