// src/screens/StartScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  ImageBackground,
  Alert,
  ToastAndroid,
  KeyboardAvoidingView,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppRoutes";
import { useTranslation } from "react-i18next";
import { useClient } from "../application/context/ClientContext";
import { validateDniFormat } from "../domain/services/ClientService";
import { ColectiuRondaLogWhite } from "../components";
import IdentityBg from "../../assets/background.png";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "Start">;

const StartScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);
  const { checkIdentity } = useClient();
  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();

  const showToast = (msg: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.LONG);
    } else {
      Alert.alert("", msg);
    }
  };

  const formWrapAnimatedStyle = useAnimatedStyle(() => {
    if (Platform.OS === "ios") return { transform: [{ translateY: 0 }] };
    const kb = keyboard.height.value;
    const baseBottom = 106 + insets.bottom;
    const lift = Math.max(0, kb - baseBottom + 46);
    return {
      transform: [{ translateY: withTiming(-lift, { duration: 220 }) }],
    };
  }, [insets.bottom]);

  const onValidate = async () => {
    if (!dni || loading) return;

    const err = validateDniFormat(dni);
    if (err) {
      console.warn(err);
      showToast(err);
      return;
    }

    setLoading(true);
    try {
      const res = await checkIdentity(dni);

      // C) Usuario completo con LOPD → login
      if (res.kind === "USER_READY") {
        navigation.navigate("Login", { dni });
        return;
      }

      // C*) Usuario completo SIN LOPD → pantalla LOPD obligatoria
      // if (res.kind === "USER_READY_NO_LOPD") {
      //   navigation.navigate("Lopd", { dni, redirectTo: "Login" });
      //   return;
      // }

      // B) Cliente existente sin usuario (tenga o no LOPD) → RequestAccess
      if (
        res.kind === "EXISTING_CLIENT_NO_LOPD" ||
        res.kind === "EXISTING_CLIENT_WITH_LOPD"
      ) {
        const hasLopdAlready = res.kind === "EXISTING_CLIENT_WITH_LOPD";
        navigation.navigate("RequestAccess", { dni, hasLopdAlready });
        return;
      }

      // A) NEW → alta cliente+usuario
      navigation.navigate("CreateUser", {
        dni,
        prefill: null,
        mode: "createClientAndUser",
        hasLopdAlready: false,
      });
    } catch (e: any) {
      // (tu mismo manejo de errores)
      const raw = e?.raw as any;
      let msg =
        (raw && (raw.errorString || raw.message)) ||
        e?.message ||
        "Error de validación";

      if (
        e?.status === 400 &&
        (e?.code === 33 || raw?.code === 33) &&
        raw?.errorString
      ) {
        msg = raw.errorString;
      }
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={IdentityBg}
        style={styles.bg}
        resizeMode="cover"
        imageStyle={styles.bgImage}
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safe}>
          {/* HEADER fijo */}
          <View style={styles.header}>
            <ColectiuRondaLogWhite width={300} />
          </View>

          {/* FORM */}
          {Platform.OS === "ios" ? (
            <KeyboardAvoidingView style={styles.formAvoider} behavior="padding">
              <Animated.View style={[styles.formWrap]}>
                <Text style={styles.instructions}>
                  {t("start.instructions", {
                    defaultValue:
                      "Introduïu el teu NIF/DNI per validar el teu compte.",
                  })}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder={t("start.dni_placeholder", {
                    defaultValue: "NIF/DNI",
                  })}
                  placeholderTextColor="#888"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  keyboardType={Platform.select({
                    web: "default",
                    default: "default",
                  })}
                  value={dni}
                  onChangeText={setDni}
                  returnKeyType="done"
                  onSubmitEditing={onValidate}
                />

                <Pressable
                  onPress={onValidate}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    loading && styles.buttonDisabled,
                  ]}
                >
                  <Text style={styles.buttonText}>
                    {loading
                      ? t("splash.loading", { defaultValue: "Cargando…" })
                      : t("start.validate", { defaultValue: "Validar DNI" })}
                  </Text>
                </Pressable>
              </Animated.View>
            </KeyboardAvoidingView>
          ) : (
            <Animated.View style={[styles.formWrap, formWrapAnimatedStyle]}>
              <Text style={styles.instructions}>
                {t("start.instructions", {
                  defaultValue:
                    "Introduïu el teu NIF/DNI per validar el teu compte.",
                })}
              </Text>

              <TextInput
                style={styles.input}
                placeholder={t("start.dni_placeholder", {
                  defaultValue: "NIF/DNI",
                })}
                placeholderTextColor="#888"
                autoCapitalize="characters"
                autoCorrect={false}
                keyboardType={Platform.select({
                  web: "default",
                  default: "default",
                })}
                value={dni}
                onChangeText={setDni}
                returnKeyType="done"
                onSubmitEditing={onValidate}
              />

              <Pressable
                onPress={onValidate}
                disabled={loading}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                  loading && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.buttonText}>
                  {loading
                    ? t("splash.loading", { defaultValue: "Cargando…" })
                    : t("start.validate", { defaultValue: "Validar DNI" })}
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const BRAND = "#970c1f";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  bg: { flex: 1, width: "100%", height: "100%" },
  bgImage: { objectFit: "cover" as any },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 62,
    paddingBottom: 8,
    alignItems: "flex-start",
  },
  formAvoider: { flex: 1 },
  formWrap: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 106,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  instructions: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.95,
  },
  input: {
    backgroundColor: "#fff",
    color: "#111827",
    height: 48,
    borderRadius: 999,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 16,
  },
  button: {
    height: 56,
    borderRadius: 999,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  buttonPressed: { opacity: 0.9 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "700" },
});

export default StartScreen;
