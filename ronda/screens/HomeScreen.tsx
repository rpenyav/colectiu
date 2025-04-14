import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/styles";
import useTranslation from "../i18n/useTranslation";

export default function HomeScreen() {
  const { t } = useTranslation();
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Home Screen</Text>
      <Text style={styles.screenSubtitle}>{t("welcome")}</Text>
    </View>
  );
}
