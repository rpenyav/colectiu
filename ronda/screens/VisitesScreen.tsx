import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/styles";

export default function VisitesScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>VisitesScreen</Text>
      <Text style={styles.screenSubtitle}>
        Explore the app using the drawer menu!
      </Text>
    </View>
  );
}
