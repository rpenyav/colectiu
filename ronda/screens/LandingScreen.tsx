import React, { useEffect } from "react";
import { View } from "react-native";
import ColLectiuRondaLogo from "./components/ColLectiuRondaLogo";
import Spinner from "./components/Spinner";
import { styles } from "../styles/styles";

export default function LandingScreen({
  navigation,
}: {
  readonly navigation: any;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Main");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.background}>
      <ColLectiuRondaLogo style={styles.logo} />
      <Spinner style={styles.spinner} />
    </View>
  );
}
