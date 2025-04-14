import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/styles";

export default function AgendaScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>AgendaScreen</Text>
      <Text style={styles.screenSubtitle}>
        Explore the app using the drawer menu!
      </Text>
    </View>
  );
}
