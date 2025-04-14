import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { stylesShared } from "../../../styles/styles";

interface CustomTextInputProps extends TextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

export default function CustomTextInput({
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  style,
  ...rest
}: CustomTextInputProps) {
  return (
    <TextInput
      style={[stylesShared.input, style]}
      placeholder={placeholder}
      placeholderTextColor="#888"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
      {...rest}
    />
  );
}
