// src/screens/CreateUserScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Switch,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppRoutes";
import type { LopdConsents, LopdConsentsDTO } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "CreateUser">;

const toDTO = (c: LopdConsents): LopdConsentsDTO => ({
  swCampanyas: c.campanyas ? "S" : "N",
  swCircular: c.circular ? "S" : "N",
  swTratamiento: c.tratamiento ? "S" : "N",
});

const CreateUserScreen: React.FC<Props> = ({ route, navigation }) => {
  const { dni, prefill, mode, hasLopdAlready } = route.params;

  const [firstName, setFirstName] = useState(prefill?.firstName ?? "");
  const [lastName, setLastName] = useState(prefill?.lastName ?? "");
  const [email, setEmail] = useState(prefill?.email ?? "");
  const [phoneMobile, setPhoneMobile] = useState(prefill?.phoneMobile ?? "");
  const [lopd, setLopd] = useState<LopdConsents>({
    campanyas: false,
    circular: false,
    tratamiento: hasLopdAlready ? true : false,
  });

  // Puede continuar si hay email y (ya tenía LOPD o marca el tratamiento)
  const canContinue = !!email && (hasLopdAlready || lopd.tratamiento);

  const isCreateClientAndUser = mode === "createClientAndUser";
  const title = isCreateClientAndUser
    ? "Alta de cliente y usuario"
    : "Alta de usuario";
  const caption = isCreateClientAndUser
    ? "Crearemos tu ficha de cliente y la cuenta de acceso."
    : hasLopdAlready
    ? "Ya tenemos tus datos y la LOPD aceptada. Solo crearemos tu cuenta de acceso."
    : "Ya tenemos tus datos. Revisa la LOPD para crear tu cuenta de acceso.";

  const onSubmit = () => {
    const dto = toDTO(lopd);
    console.log("CreateUser: dni=", dni, {
      firstName,
      lastName,
      email,
      phoneMobile,
      lopdDTO: dto,
      mode,
      hasLopdAlready,
    });
    // TODO:
    // - Si mode === "createClientAndUser" => alta cliente + usuario (+ LOPD si aplica)
    // - Si mode === "createUserOnly"       => alta usuario (si hasLopdAlready=false, incluir aceptación LOPD)
    navigation.navigate("Login", { dni });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.caption}>DNI: {dni}</Text>
      <Text style={[styles.caption, { marginBottom: 12 }]}>{caption}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellidos"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Móvil"
        value={phoneMobile}
        onChangeText={setPhoneMobile}
        keyboardType="phone-pad"
      />

      {/* LOPD solo si NO la tenía aceptada */}
      {!hasLopdAlready && (
        <>
          <View style={styles.row}>
            <Switch
              value={lopd.tratamiento}
              onValueChange={(v) => setLopd((s) => ({ ...s, tratamiento: v }))}
            />
            <Text style={styles.label}>Acepto la LOPD (obligatorio)</Text>
          </View>
          <View style={styles.row}>
            <Switch
              value={lopd.circular}
              onValueChange={(v) => setLopd((s) => ({ ...s, circular: v }))}
            />
            <Text style={styles.label}>Recibir circulares (opcional)</Text>
          </View>
          <View style={styles.row}>
            <Switch
              value={lopd.campanyas}
              onValueChange={(v) => setLopd((s) => ({ ...s, campanyas: v }))}
            />
            <Text style={styles.label}>
              Comunicaciones comerciales (opcional)
            </Text>
          </View>
        </>
      )}

      <Pressable
        disabled={!canContinue}
        style={[styles.button, !canContinue && { opacity: 0.5 }]}
        onPress={onSubmit}
      >
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#0B0B0C" },
  title: { color: "#fff", fontWeight: "800", fontSize: 20, marginBottom: 4 },
  caption: { color: "#9CA3AF", marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 8,
  },
  label: { color: "#fff" },
  button: {
    backgroundColor: "#970c1f",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#fff", fontWeight: "700" },
});

export default CreateUserScreen;
