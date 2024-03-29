import { StyleSheet } from "react-native";

const passwordsStyles = StyleSheet.create({
  noPasswordsView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  noPasswordsText: {
    fontSize: 20,
    width: "90%",
    textAlign: "center",
  },
  topView: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  sortButton: {
    width: 225,
  },
  sortButtonText: {
    fontSize: 13,
    textAlign: "center",
  },
});

export { passwordsStyles };
