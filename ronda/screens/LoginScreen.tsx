import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../auth/context/AuthContext";

import { Portal, Dialog, Paragraph, Button } from "react-native-paper";
import { AuthRepositoryImpl } from "../auth/repositories/AuthRepositoryImpl";
import { AuthService } from "../auth/services/AuthService";
import ColLectiuRondaLogoheader from "./components/ColLectiuRondaLogoHeader";
import CustomTextInput from "./components/shared/CustomTextInput";
import CustomButton from "./components/shared/CustomButton";
import { styles } from "../styles/styles";
import { StackParamList } from "../interfaces/interfaces";

const authRepository = new AuthRepositoryImpl();
const authService = new AuthService(authRepository);

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login, isLogged } = useAuth();
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();

  useEffect(() => {
    console.log("LoginScreen - isLogged:", isLogged);
    if (isLogged) {
      console.log("LoginScreen - Redirecting to Landing");
      navigation.replace("Landing");
    }
  }, [isLogged, navigation]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const token = await authService.login(email, password);
      await login(token);
      console.log("LoginScreen - Login successful, token:", token);
    } catch (error: any) {
      setErrorMessage(error.message || "Error al iniciar sesión");
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <ColLectiuRondaLogoheader />
      </View>

      <CustomTextInput
        placeholder="Email"
        keyboardType="email-address"
        secureTextEntry={false}
        value={email}
        onChangeText={setEmail}
      />

      <CustomTextInput
        placeholder="Contraseña"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <CustomButton
        text="Iniciar Sesión"
        onPress={handleLogin}
        disabled={loading}
      />

      <Portal>
        <Dialog visible={errorVisible} onDismiss={() => setErrorVisible(false)}>
          <Dialog.Title>Error</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{errorMessage}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setErrorVisible(false)}>Cerrar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
