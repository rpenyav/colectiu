import React from "react";
import { View } from "react-native";
import { Text, IconButton } from "react-native-paper";

import { styles } from "../styles/styles";
import { SubChildScreenProps } from "../interfaces/interfaces";

export default function SubChildScreen({
  route,
  navigation,
}: SubChildScreenProps) {
  const { label } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: `Subhijo: ${label}`,
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
    <View style={styles.subContainer}>
      <Text style={styles.title}>Subhijo: ${label}</Text>
      <Text style={styles.content}>
        Aquí se mostraría el contenido específico para el subhijo "${label}".
      </Text>
    </View>
  );
}
