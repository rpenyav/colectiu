// src/screens/StartScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { validateDni } from "../utils/dni";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppRoutes";

type Props = NativeStackScreenProps<RootStackParamList, "Start">;

const StartScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);

  const onValidate = async () => {
    if (!dni) return;
    setLoading(true);
    try {
      const result = await validateDni(dni);
      if (result === "CAN_LOGIN")
        navigation.navigate("ResultCanLogin", { dni });
      else if (result === "NEEDS_LOPD")
        navigation.navigate("ResultNeedsLopd", { dni });
      else navigation.navigate("ResultCreateUser", { dni });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{t("start.title")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("start.dni_placeholder")}
          autoCapitalize="characters"
          autoCorrect={false}
          value={dni}
          onChangeText={setDni}
          returnKeyType="done"
          onSubmitEditing={onValidate}
        />
        <Pressable
          onPress={onValidate}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? t("splash.loading") : t("start.validate")}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F7F8FA",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#E0E3E7",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: "#FBFBFD",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#0A84FF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  pressed: { opacity: 0.85 },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
});

export default StartScreen;
