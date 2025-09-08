// src/components/ToastComponent.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Toast, {
  ToastConfig,
  ToastShowParams,
} from "react-native-toast-message";

const COLORS = {
  bg: "#111827", // gris muy oscuro
  error: "#dc2626", // rojo tailwind-600
  errorText: "#fff",
  border: "#7f1d1d",
};

const ErrorToastView: React.FC<{ text1?: string; text2?: string }> = ({
  text1,
  text2,
}) => (
  <View style={styles.container}>
    <View style={styles.redBar} />
    <View style={styles.content}>
      {!!text1 && <Text style={styles.title}>{text1}</Text>}
      {!!text2 && <Text style={styles.msg}>{text2}</Text>}
    </View>
  </View>
);

export const toastConfig: ToastConfig = {
  // Sobrescribimos el tipo "error"
  error: ({ text1, text2 }) => <ErrorToastView text1={text1} text2={text2} />,
};

export const showErrorToast = (
  text1: string,
  text2?: string,
  params?: Omit<ToastShowParams, "type" | "text1" | "text2">
) => Toast.show({ type: "error", text1, text2, ...(params ?? {}) });

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    minWidth: 280,
    maxWidth: 420,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  redBar: { width: 6, backgroundColor: COLORS.error },
  content: { paddingVertical: 10, paddingHorizontal: 12, flexShrink: 1 },
  title: {
    color: COLORS.errorText,
    fontWeight: "800",
    fontSize: 15,
    marginBottom: 2,
  },
  msg: { color: "#e5e7eb", fontSize: 13 },
});
