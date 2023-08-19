import { StyleSheet } from "react-native";

const securityStyle = StyleSheet.create({
  securityContent: {
    marginTop: 50,
    alignItems: "center",
  },
  categoryName: {
    fontSize: 20,
    textDecorationLine: "underline",
  },
  scrollView: {
    flexGrow: 1,
    minWidth: "90%",
    paddingBottom: 100,
  },
  text: {
    marginTop: 60,
    fontSize: 20,
    maxWidth: "80%",
    fontWeight: "800",
    textAlign: "center",
  },
});

export { securityStyle };
