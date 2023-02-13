import { StyleSheet } from "react-native";

const settingsStyle = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 30,
  },
  settingsContent: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginTop: 50,
  },
  category: {
    marginLeft: 20,
    marginTop: 25,
  },
  categoryName: {
    fontSize: 24,
  },
  categoryContent: {
    marginLeft: 25,
  },
  radioView: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentText: {
    fontSize: 16,
  },
});

export { settingsStyle };
