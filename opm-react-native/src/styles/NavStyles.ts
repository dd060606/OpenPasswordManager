import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  menu: {
    backgroundColor: "rgba(198,237,240, 0.35)",
    width: "100%",
    height: "100%",
  },
  navButton: {
    marginTop: 5,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
  },
  navButtonPart: {
    width: 35,
    height: 6,
    backgroundColor: "black",
    borderRadius: 5,
    marginVertical: 2,
  },
  navButtonClose1: {
    transform: [{ rotate: "45deg" }],
    borderRadius: 0,
    marginVertical: 0,
  },
  navButtonClose2: {
    transform: [{ rotate: "-45deg" }],
    borderRadius: 0,
    marginVertical: -5,
  },
  navMenu: {
    width: "100%",
    alignItems: "center",
  },
  menuLink: {
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  menuLinkText: {
    fontSize: 25,
    fontWeight: "bold",
    textDecorationLine: "underline",
    textDecorationColor: "black",
  },
  menuLinkIcon: {
    marginRight: 5,
    width: 30,
    height: 30,
  },
});

export { styles };
