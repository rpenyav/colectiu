import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import { stylesShared } from "../../../styles/styles";

interface SendButtonProps extends Omit<TouchableOpacityProps, "onPress"> {
  text: string;
  onPress: () => void;
}

export default function CustomButton({
  text,
  onPress,
  style,
  ...rest
}: SendButtonProps) {
  return (
    <TouchableOpacity
      style={[stylesShared.button, style]}
      onPress={onPress}
      {...rest}
    >
      <Text style={stylesShared.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}
