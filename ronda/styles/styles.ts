import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  screenSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1C2526",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#1C2526",
    textAlign: "center",
  },
  spinner: {
    marginBottom: 20,
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  subContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  headerButton: {
    marginLeft: 10,
  },
  content: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
  },

  commonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  commonContentText: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
  },
  commonHeaderButton: {
    marginLeft: 10,
  },
  commonScreenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C2526",
    marginBottom: 20,
  },
  commonSubtitleText: {
    fontSize: 16,
    color: "#666",
  },

  paddedContainer: {
    padding: 20,
  },
});

export const stylesMenu = StyleSheet.create({
  itemContainer: {
    paddingVertical: 5,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  parentLabel: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "bold",
  },
  subMenuLabel: {
    fontSize: 16,
    color: "#333333",
  },
  subMenuLabelExpanded: {
    fontSize: 16,
    color: "#0000FF",
    fontWeight: "bold",
  },
  subChildLabel: {
    fontSize: 16,
    color: "#666666",
  },
  chevron: {
    marginRight: 10,
  },
  subMenu: {
    marginLeft: 10,
    marginTop: 2,
  },
});

export const stylesShared = StyleSheet.create({
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#1C2526",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 10,
  },
  logoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 20,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 15.7,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#800020",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export const stylesDrawer = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 10,
  },
  drawerBackground: {
    backgroundColor: "#ffffff",
  },
  drawerLabelStyle: {
    color: "#333333",
    fontSize: 16,
  },
  containerProfileImage: {
    height: 160,
    ...(Platform.OS === "web" && { width: 150 }),
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS === "web" && {
      width: 150,
      height: 160,
    }),
  },
  avatarContainer: {
    width: 80,
    marginTop: 20,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  drawerName: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  avatarContainerBig: {
    width: 180,
    height: 180,
    marginTop: 0,
    marginBottom: 30,
    borderRadius: 120,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#666666",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "transparent", // Fondo transparente para evitar el gris
  },
});
