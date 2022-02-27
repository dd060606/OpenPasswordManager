import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 250,
    height: 100,
    position: "absolute",
    top: 100,
  },
  title: {
    fontSize: 35,
    fontFamily: "OpenSansBold",
  },
});

const loginStyles = StyleSheet.create({});

const registerStyles = StyleSheet.create({});

export { loginStyles, registerStyles, commonStyles };
