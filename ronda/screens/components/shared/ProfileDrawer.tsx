import React from "react";
import { View, ImageBackground, Image, Text } from "react-native";
import { stylesDrawer } from "../../../styles/styles";
import { ProfileDrawerProps } from "../../../interfaces/interfaces";
import { useUser } from "../../../context/UserContext";
import { useAuth } from "../../../auth/context/AuthContext";
import useTranslation from "../../../i18n/useTranslation";

// Imágenes predeterminadas
const noback = require("../../../assets/noback.png");
const noavatar = require("../../../assets/noavatar.png");

export default function ProfileDrawer({ backgroundImage }: ProfileDrawerProps) {
  const { user, loading, avatarUri } = useUser();
  const { t } = useTranslation();
  const { token } = useAuth();

  return (
    <View style={stylesDrawer.containerProfileImage}>
      <ImageBackground
        source={backgroundImage ? { uri: backgroundImage } : noback}
        style={stylesDrawer.background}
        resizeMode="cover"
      >
        <View style={stylesDrawer.avatarContainer}>
          <Image
            source={
              avatarUri
                ? {
                    uri: avatarUri,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                : noavatar
            }
            style={stylesDrawer.avatar}
            resizeMode="cover"
            onError={(error) => {
              console.error(
                "ProfileDrawer - Error loading avatar:",
                error.nativeEvent.error
              );
            }}
            onLoad={() => {
              console.log("ProfileDrawer - Avatar loaded successfully");
            }}
          />
        </View>
        {loading ? (
          <Text style={stylesDrawer.drawerName}>Cargando...</Text>
        ) : user ? (
          <Text style={stylesDrawer.drawerName}>
            {user.user.individual.name} {user.user.individual.surname}
          </Text>
        ) : (
          <Text style={stylesDrawer.drawerName}>Usuario no disponible</Text>
        )}
      </ImageBackground>
    </View>
  );
}
