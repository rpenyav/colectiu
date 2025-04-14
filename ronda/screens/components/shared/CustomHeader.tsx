import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";

import type { DrawerNavigationProp } from "@react-navigation/drawer";
import ColLectiuRondaLogoheader from "../ColLectiuRondaLogoHeader";
import { stylesShared } from "../../../styles/styles";
import { DrawerParamList } from "../../../interfaces/interfaces";

interface CustomHeaderProps {
  navigation: DrawerNavigationProp<DrawerParamList>;
}

export default function CustomHeader({ navigation }: CustomHeaderProps) {
  return (
    <SafeAreaView style={stylesShared.header}>
      {/* Ícono de menú a la izquierda */}
      <TouchableOpacity
        onPress={() => navigation.toggleDrawer()}
        style={[stylesShared.menuContainer, { zIndex: 2 }]}
      >
        <Icon
          name="menu"
          size={24}
          color="#333333"
          style={stylesShared.menuIcon}
        />
      </TouchableOpacity>

      {/* Logo centrado */}
      <View style={[stylesShared.logoContainer, { zIndex: 1 }]}>
        <ColLectiuRondaLogoheader style={stylesShared.logo} />
      </View>

      {/* Ícono de perfil a la derecha */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={{ zIndex: 2 }}
      >
        <Icon name="person" size={24} color="#333333" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
