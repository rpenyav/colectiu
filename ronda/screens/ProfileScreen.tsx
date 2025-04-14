import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useUser } from "../context/UserContext";
import { styles, stylesDrawer } from "../styles/styles";
import { useAuth } from "../auth/context/AuthContext";

export default function ProfileScreen() {
  const { user, loading, error, avatarUri } = useUser();

  const noavatar = require("../assets/noavatar.png");
  const { token } = useAuth();

  // Log adicional para confirmar cambios en el estado
  useEffect(() => {
    console.log("ProfileScreen - State updated:", { user, loading, error });
  }, [user, loading, error]);

  console.log("ProfileScreen - Rendering with state:", {
    user,
    loading,
    error,
  });

  return (
    <View style={[styles.commonContainer, localStyles.paddedContainer]}>
      <View style={stylesDrawer.avatarContainerBig}>
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

      <Text style={styles.commonScreenTitle}>
        {user!.user.individual.name} {user!.user.individual.surname}
      </Text>

      {loading ? (
        <Text style={styles.commonContentText}>
          Cargando datos del usuario...
        </Text>
      ) : error ? (
        <Text style={styles.commonContentText}>Error: {error}</Text>
      ) : user ? (
        <>
          <Text style={styles.commonContentText}>
            Usuario: {user.user.username}
          </Text>

          <Text style={styles.commonContentText}>
            Perfil de Seguridad:{" "}
            {user.user.securityProfile.literalDescriptionText}
          </Text>
          {user.user.individual.addresses.length > 0 ? (
            <Text style={styles.commonContentText}>
              Dirección: {user.user.individual.addresses[0].street}
            </Text>
          ) : (
            <Text style={styles.commonContentText}>
              Dirección: No disponible
            </Text>
          )}
        </>
      ) : (
        <Text style={styles.commonContentText}>
          No se encontraron datos del usuario.
        </Text>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  paddedContainer: {
    padding: 20,
  },
});
