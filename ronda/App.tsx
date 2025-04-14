import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./screens/components/navigation/AppNavigator";
import { AuthProvider } from "./auth/context/AuthContext";
import { PaperProvider } from "react-native-paper";
import { UserProvider } from "./context/UserContext";
import { LanguageProvider } from "./context/LanguageContext";

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <AuthProvider>
          <LanguageProvider>
            <UserProvider>
              <AppNavigator />
            </UserProvider>
          </LanguageProvider>
        </AuthProvider>
      </PaperProvider>
    </NavigationContainer>
  );
}
