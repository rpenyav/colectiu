import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleProp, ViewStyle } from "react-native";
import { MenuItem } from "../constants/drawerMenu";

export type StackParamList = {
  Login: undefined;
  Landing: undefined;
  Main: undefined;
};

export type StackParamListSubChild = {
  SubChild: { id: string; label: string };
};

type SubChildScreenRouteProp = RouteProp<StackParamListSubChild, "SubChild">;
type SubChildScreenNavigationProp = StackNavigationProp<
  StackParamListSubChild,
  "SubChild"
>;

export interface SubChildScreenProps {
  route: SubChildScreenRouteProp;
  navigation: SubChildScreenNavigationProp;
}

// Define the param list for the Stack Navigator
export type StackParamListSubmenu = {
  SubMenu: { id: string; label: string };
};

// Define the props for the screen
type SubMenuScreenRoutePropSub = RouteProp<StackParamListSubmenu, "SubMenu">;
type SubMenuScreenNavigationProp = StackNavigationProp<
  StackParamListSubmenu,
  "SubMenu"
>;

export interface SubMenuScreenProps {
  route: SubMenuScreenRoutePropSub;
  navigation: SubMenuScreenNavigationProp;
}

export interface SpinnerProps {
  style?: StyleProp<ViewStyle>;
}

export interface FullColLectiuRondaLogoProps {
  style?: StyleProp<ViewStyle>;
}

export interface ColLectiuRondaLogoProps {
  style?: StyleProp<ViewStyle>;
}

export type StackParamListCollap = {
  SubMenu: { id: string; label: string };
  SubChild: { id: string; label: string };
};

export interface CollapsibleMenuItemProps {
  item: MenuItem;
  level?: number;
}

export type DrawerParamList = {
  Home: undefined;
  Profile: undefined;
  Expedients: undefined;
  Clients: undefined;
  Agenda: undefined;
  Abonaments: undefined;
  Facturacio: undefined;
  Visites: undefined;
  Documentacio: undefined;
};

export type StackParamListDrawer = {
  Login: undefined;
  Landing: undefined;
  Main: undefined;
};

export type StackParamListNavigator = {
  Login: undefined;
  Landing: undefined;
  Main: undefined;
  SubMenu: { id: string; label: string };
  SubChild: { id: string; label: string };
};

export interface FetchWithAuthOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

export interface ProfileDrawerProps {
  backgroundImage?: string; // URL o path de la imagen de fondo (futuro)
  avatarImage?: string; // URL o path de la imagen del avatar (futuro)
}
