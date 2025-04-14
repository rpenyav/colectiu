import React from "react";
import "react-native-gesture-handler";
import AppNavigator from "./screens/components/navigation/AppNavigator";
import { AuthProvider } from "./auth/context/AuthContext";
import { PaperProvider } from "react-native-paper";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <UserProvider>
          <AppNavigator />
        </UserProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
