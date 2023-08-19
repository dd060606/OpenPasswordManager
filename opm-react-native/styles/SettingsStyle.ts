import { StyleSheet } from "react-native";

const settingsStyle = StyleSheet.create({
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
  logoutButton: {
    padding: 10,
    backgroundColor: "#F04B1F",
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
});

export { settingsStyle };
