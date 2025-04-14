import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { stylesMenu } from "../../styles/styles";
import {
  CollapsibleMenuItemProps,
  StackParamListCollap,
} from "../../interfaces/interfaces";

export default function CollapsibleMenuItem({
  item,
  level = 0,
}: CollapsibleMenuItemProps) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const navigation = useNavigation<StackNavigationProp<StackParamListCollap>>();

  // Determinar el estilo del label según el nivel
  const getLabelStyle = () => {
    switch (level) {
      case 0: // Padre (Auxiliars, Llistats)
        return stylesMenu.parentLabel;
      case 1: // Submenú (Abonaments, Calendaris, Listas)
        return expanded
          ? stylesMenu.subMenuLabelExpanded
          : stylesMenu.subMenuLabel;
      default: // Subhijo (Classes d'abonament, Cobertures d'abonament, Festivos, Arrays)
        return stylesMenu.subChildLabel;
    }
  };

  // Manejar la navegación según el nivel
  const handlePress = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    } else if (level === 1) {
      navigation.navigate("SubMenu", { id: item.id, label: item.label });
    } else if (level >= 2) {
      navigation.navigate("SubChild", { id: item.id, label: item.label });
    }
  };

  return (
    <View>
      {/* Ítem principal */}
      <TouchableOpacity
        style={[stylesMenu.itemContainer, { paddingLeft: 10 + level * 20 }]} // Indentación según el nivel
        onPress={handlePress}
      >
        <View style={stylesMenu.itemContent}>
          <Text style={getLabelStyle()}>{item.label}</Text>
          {hasChildren && (
            <IconButton
              icon={expanded ? "chevron-down" : "chevron-right"}
              size={20}
              onPress={() => setExpanded(!expanded)}
              style={stylesMenu.chevron}
              iconColor={level === 1 && expanded ? "#0000FF" : "#333333"} // Color azul para submenús expandidos
            />
          )}
        </View>
      </TouchableOpacity>

      {/* Submenús (si existen y está expandido) */}
      {hasChildren && expanded && (
        <View style={stylesMenu.subMenu}>
          {item.children!.map((child, index) => (
            <CollapsibleMenuItem key={index} item={child} level={level + 1} />
          ))}
        </View>
      )}
    </View>
  );
}
