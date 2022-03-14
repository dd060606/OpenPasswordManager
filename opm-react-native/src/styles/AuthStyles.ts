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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 12,
    },
    shadowOpacity: 0.23,
    shadowRadius: 15,
    elevation: 15,
  },
  modalButton: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 6,
    marginTop: 20,
  },
  modalButtonText: { fontSize: 23 },
  modalImg: {
    width: 64,
    height: 64,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 30,
  },
  modalText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
  },
  link: {
    marginTop: 15,
    fontSize: 16,
  },
});

const loginStyles = StyleSheet.create({});

const registerStyles = StyleSheet.create({
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 30,
    marginBottom: 25,
    width: "90%",
  },
});

const emailConfirmationStyles = StyleSheet.create({
  emailText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  confirmEmailText: {
    marginTop: 8,
    fontSize: 17,
    textAlign: "center",
  },
  sendEmailText: {
    marginTop: 8,
    fontSize: 17,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
});

export { loginStyles, registerStyles, commonStyles, emailConfirmationStyles };
