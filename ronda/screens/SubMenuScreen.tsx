import React from "react";
import { View } from "react-native";
import { Text, IconButton } from "react-native-paper";

import { styles } from "../styles/styles";
import { SubMenuScreenProps } from "../interfaces/interfaces";

export default function SubMenuScreen({
  route,
  navigation,
}: SubMenuScreenProps) {
  const { label } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: `Submenú: ${label}`,
      headerLeft: () => (
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          iconColor="#333333"
          style={styles.headerButton}
        />
      ),
    });
  }, [navigation, label]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submenú: {label}</Text>
      <Text style={styles.content}>
        Aquí se mostraría el contenido específico para el submenú "{label}".
      </Text>
    </View>
  );
}
