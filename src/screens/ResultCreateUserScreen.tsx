// src/screens/ResultCreateUserScreen.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppRoutes";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<RootStackParamList, "ResultCreateUser">;

const ResultCreateUserScreen: React.FC<Props> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { dni } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("results.create_user_title")}</Text>
      <Text style={styles.subtitle}>{dni}</Text>
      <Pressable
        style={styles.btn}
        onPress={() => navigation.navigate("Start")}
      >
        <Text style={styles.btnText}>← {t("common.continue")}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8 },
  subtitle: { color: "#6B7280", marginBottom: 24 },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#0A84FF",
  },
  btnText: { color: "#fff", fontWeight: "700" },
});

export default ResultCreateUserScreen;
