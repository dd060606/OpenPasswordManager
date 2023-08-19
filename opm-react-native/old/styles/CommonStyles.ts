import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
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
    fontFamily: "OpenSansBold",
  },
  modalText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
  },
});

export { commonStyles };
