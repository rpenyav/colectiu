import React, { useEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Portal, Dialog, Paragraph, Button } from "react-native-paper";
import { View } from "react-native";
import { useAuth } from "../../../auth/context/AuthContext";
import { drawerMenu } from "../../../constants/drawerMenu";
import {
  DrawerParamList,
  StackParamListDrawer,
} from "../../../interfaces/interfaces";
import { stylesDrawer } from "../../../styles/styles";
import HomeScreen from "../../HomeScreen";
import ProfileScreen from "../../ProfileScreen";
import CollapsibleMenuItem from "../CollapsibleMenuItem";
import CustomHeader from "../shared/CustomHeader";
import ProfileDrawer from "../shared/ProfileDrawer";
import AbonamentsScreen from "../../AbonamentsScreen";
import AgendaScreen from "../../AgendaScreen";
import ClientsScreen from "../../ClientsScreen";
import DocumentacioScreen from "../../DocumentacioScreen";
import ExpedientsScreen from "../../ExpedientsScreen";
import FacturacioScreen from "../../FacturacioScreen";
import VisitesScreen from "../../VisitesScreen";

const Drawer = createDrawerNavigator<DrawerParamList>();

function CustomDrawerContent(props: any) {
  const { logout } = useAuth();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  return (
    <View style={stylesDrawer.container}>
      {/* Nuevo componente ProfileDrawer en la parte superior */}
      <ProfileDrawer />

      {/* Contenido del drawer (ítems del menú) */}
      <DrawerContentScrollView {...props} style={stylesDrawer.scrollView}>
        <DrawerItemList {...props} />

        {drawerMenu.map((item, index) => (
          <CollapsibleMenuItem key={index} item={item} />
        ))}
      </DrawerContentScrollView>

      <View style={stylesDrawer.logoutContainer}>
        <DrawerItem
          label="Cerrar Sesión"
          onPress={() => setLogoutDialogVisible(true)}
          labelStyle={stylesDrawer.drawerLabelStyle}
          icon={({ color, size }) => (
            <Icon name="logout" size={size} color="#333333" />
          )}
        />
      </View>

      <Portal>
        <Dialog
          visible={logoutDialogVisible}
          onDismiss={() => setLogoutDialogVisible(false)}
        >
          <Dialog.Title>Cerrar Sesión</Dialog.Title>
          <Dialog.Content>
            <Paragraph>¿Estás seguro de que deseas cerrar sesión?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>
              Cancelar
            </Button>
            <Button
              onPress={async () => {
                await logout();
                setLogoutDialogVisible(false);
              }}
            >
              Sí
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

export default function DrawerNavigator() {
  const { isLogged } = useAuth();
  const navigation = useNavigation<StackNavigationProp<StackParamListDrawer>>();

  useEffect(() => {
    if (!isLogged) {
      navigation.replace("Login");
    }
  }, [isLogged, navigation]);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: stylesDrawer.drawerBackground,
        drawerLabelStyle: stylesDrawer.drawerLabelStyle,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}
      />
      <Drawer.Screen
        name="Expedients"
        component={ExpedientsScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}
      />
      <Drawer.Screen
        name="Clients"
        component={ClientsScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}
      />
      <Drawer.Screen
        name="Agenda"
        component={AgendaScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}
      />

      <Drawer.Screen
        name="Abonaments"
        component={AbonamentsScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}
      />
      <Drawer.Screen
        name="Facturacio"
        component={FacturacioScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}
      />
      <Drawer.Screen
        name="Visites"
        component={VisitesScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}
      />

      <Drawer.Screen
        name="Documentacio"
        component={DocumentacioScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />,
        })}
      />
    </Drawer.Navigator>
  );
}
