import { StyleSheet } from "react-native";

const homeStyles = StyleSheet.create({});

const loadingStyles = StyleSheet.create({
  animatedView: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -125,
    marginLeft: -125,
  },
  spinner: {
    borderStyle: "solid",
    borderWidth: 8,
    borderColor: "#E0F3FC",
    borderRadius: 150,
    width: 250,
    height: 250,
    borderTopColor: "#54c2f0",
    borderTopWidth: 8,
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -75,
    marginLeft: -75,
    width: 150,
    height: 150,
  },
});

const credentialsElementStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: 50,
    backgroundColor: "red",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logo: {
    width: 46,
    height: 30,
  },
});

export { homeStyles, loadingStyles, credentialsElementStyles };
