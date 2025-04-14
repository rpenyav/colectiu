import React from "react";
import { View, ActivityIndicator } from "react-native";
import { SpinnerProps } from "../../interfaces/interfaces";

export default function Spinner({ style }: SpinnerProps) {
  return (
    <View style={style}>
      <ActivityIndicator size="large" color="#800020" />
    </View>
  );
}
