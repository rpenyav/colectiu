// src/navigation/AppRoutes.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import {
  ResultCanLoginScreen,
  ResultCreateUserScreen,
  ResultNeedsLopdScreen,
  StartScreen,
} from "../screens";

export type RootStackParamList = {
  Splash: undefined;
  Start: undefined;
  ResultCanLogin: { dni: string };
  ResultNeedsLopd: { dni: string };
  ResultCreateUser: { dni: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppRoutes = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", // transición animada entre pantallas
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ animation: "fade" }}
      />
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="ResultCanLogin" component={ResultCanLoginScreen} />
      <Stack.Screen name="ResultNeedsLopd" component={ResultNeedsLopdScreen} />
      <Stack.Screen
        name="ResultCreateUser"
        component={ResultCreateUserScreen}
      />
    </Stack.Navigator>
  );
};

export default AppRoutes;
