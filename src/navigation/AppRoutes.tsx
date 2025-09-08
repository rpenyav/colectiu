// src/navigation/AppRoutes.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import StartScreen from "../screens/StartScreen";
import { CreateUserScreen, LoginScreen, LopdScreen } from "../screens";
import RequestAccessScreen from "../screens/RequestAccessScreen";
import CallbackNewUserScreen from "../screens/CallbackNewUserScreen";
import DashboardScreen from "../screens/DashboardScreen"; // 👈 nuevo
import type { IndividualClient } from "../types";

export type CreateUserMode = "createClientAndUser" | "createUserOnly";

export type RootStackParamList = {
  Splash: undefined;
  Start: undefined;
  RequestAccess: { dni: string; hasLopdAlready: boolean };
  CallbackNewUser: { token: string; lang?: string };
  CreateUser: {
    dni: string;
    prefill: IndividualClient | null;
    mode: CreateUserMode;
    hasLopdAlready: boolean;
  };
  Lopd: { dni: string; redirectTo?: keyof RootStackParamList };
  Login: { dni: string };

  // 👇 nueva ruta privada
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppRoutes = () => (
  <Stack.Navigator
    initialRouteName="Splash"
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen
      name="Splash"
      component={SplashScreen}
      options={{ animation: "fade" }}
    />
    <Stack.Screen name="Start" component={StartScreen} />
    <Stack.Screen name="RequestAccess" component={RequestAccessScreen} />
    <Stack.Screen name="CallbackNewUser" component={CallbackNewUserScreen} />
    <Stack.Screen name="CreateUser" component={CreateUserScreen} />
    <Stack.Screen name="Lopd" component={LopdScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />

    {/* 👇 nueva pantalla */}
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
  </Stack.Navigator>
);

export default AppRoutes;
