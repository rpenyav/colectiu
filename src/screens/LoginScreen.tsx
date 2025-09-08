// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ToastAndroid,
  ImageBackground,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppRoutes";
import { useAuth } from "../application/context/AuthContext";
import { env } from "../config/env";
import IdentityBg from "../../assets/background.png";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const BRAND = "#970c1f";

const LoginScreen: React.FC<Props> = ({ route, navigation }) => {
  const { dni } = route.params;
  const { signIn, loading } = useAuth();

  const [identifier, setIdentifier] = useState<string>(dni ?? "");
  const [password, setPassword] = useState<string>("");
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();

  const notify = (msg: string) => {
    if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.LONG);
    else Alert.alert("", msg);
  };

  // ——— Android: desplazar el formulario al aparecer el teclado ———
  const formWrapAnimatedStyle = useAnimatedStyle(() => {
    if (Platform.OS === "ios") return { transform: [{ translateY: 0 }] };
    // altura del teclado:
    const kb = keyboard.height.value;
    // base inferior: padding + safe area + margen “suave”
    const baseBottom = 24 + insets.bottom + 124;
    const lift = Math.max(0, kb - baseBottom);
    return {
      transform: [{ translateY: withTiming(-lift, { duration: 220 }) }],
    };
  }, [insets.bottom]);

  const onLogin = async () => {
    if (!identifier || !password) {
      setErrorMsg("Introduce usuario y contraseña.");
      return;
    }
    if (!env.securityBaseUrl) {
      setErrorMsg("Falta configurar SECURITY_BASE_URL.");
      return;
    }

    setErrorMsg(null);
    try {
      await signIn({ username: identifier, password });
      notify("Inicio de sesión correcto.");
      navigation.replace("Dashboard");
    } catch (e: any) {
      console.error("Login error:", e);
      const apiMsg =
        e?.raw?.message || e?.message || "Usuario o contraseña incorrectos.";
      setErrorMsg(apiMsg);
    }
  };

  const FormInner = (
    <>
      <Text style={styles.title}>Iniciar sesión</Text>
      <Text style={styles.caption}>Accede con tu email o tu DNI/NIE/NIF.</Text>

      <TextInput
        style={styles.input}
        placeholder="Email o DNI"
        placeholderTextColor="#888"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={identifier}
        onChangeText={setIdentifier}
        returnKeyType="next"
        accessibilityLabel="identifier-input"
      />

      <View style={styles.pwRow}>
        <TextInput
          style={[styles.input, styles.pwInput]}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry={!showPw}
          value={password}
          onChangeText={setPassword}
          returnKeyType="go"
          onSubmitEditing={onLogin}
          accessibilityLabel="password-input"
        />
        <Pressable onPress={() => setShowPw((s) => !s)} style={styles.showBtn}>
          <Text style={styles.showText}>{showPw ? "Ocultar" : "Mostrar"}</Text>
        </Pressable>
      </View>

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <Pressable
        onPress={onLogin}
        disabled={loading}
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.9 },
          loading && { opacity: 0.7 },
        ]}
      >
        <Text style={styles.buttonText}>
          {loading ? "Entrando…" : "Entrar"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          console.log("forgot password");
        }}
        style={styles.linkBtn}
      >
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </Pressable>
    </>
  );

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
          {/* iOS usa KeyboardAvoidingView; Android usa Animated translate */}
          {Platform.OS === "ios" ? (
            <KeyboardAvoidingView
              style={styles.formAvoider}
              behavior="padding"
              keyboardVerticalOffset={0}
            >
              <View style={styles.formWrap}>{FormInner}</View>
            </KeyboardAvoidingView>
          ) : (
            <Animated.View style={[styles.formWrap, formWrapAnimatedStyle]}>
              {FormInner}
            </Animated.View>
          )}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  // Fondo como StartScreen
  container: { flex: 1, backgroundColor: "#000" },
  bg: { flex: 1, width: "100%", height: "100%" },
  bgImage: { objectFit: "cover" as any },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  safe: { flex: 1 },

  // Layout del formulario
  formAvoider: { flex: 1 },
  formWrap: {
    flex: 1,
    justifyContent: "center", // centrado vertical
    paddingHorizontal: 24,
    paddingBottom: 24,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },

  title: { color: "#fff", fontWeight: "800", fontSize: 22, marginBottom: 6 },
  caption: { color: "#D1D5DB", marginBottom: 16 },

  input: {
    backgroundColor: "#fff",
    color: "#111827",
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 12,
  },

  pwRow: { position: "relative" },
  pwInput: { paddingRight: 88 },
  showBtn: {
    position: "absolute",
    right: 8,
    top: 6,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  showText: { color: BRAND, fontWeight: "700" },

  button: {
    height: 54,
    borderRadius: 12,
    backgroundColor: BRAND,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  linkBtn: { marginTop: 12, alignSelf: "center" },
  link: { color: "#e5e7eb", textDecorationLine: "underline" },

  error: { color: "#fca5a5", marginBottom: 8 },
});

export default LoginScreen;
