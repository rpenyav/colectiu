import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigator from "./DrawerNavigator";
import LandingScreen from "../../LandingScreen";
import LoginScreen from "../../LoginScreen";
import SubChildScreen from "../../SubChildScreen";
import SubMenuScreen from "../../SubMenuScreen";
import { StackParamListNavigator } from "../../../interfaces/interfaces";

const Stack = createStackNavigator<StackParamListNavigator>();

export default function AppNavigator() {
  return (
    // <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SubMenu"
        component={SubMenuScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SubChild"
        component={SubChildScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
}
