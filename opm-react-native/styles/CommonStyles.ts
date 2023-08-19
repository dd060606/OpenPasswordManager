import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalTitle: { fontSize: 35, fontFamily: "OpenSansBold" },
  modalView: {
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 13,
    },
    shadowOpacity: 0.24,
    shadowRadius: 14.86,
    elevation: 18,
  },
  modalButton: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 6,
    marginTop: 20,
  },
  modalButtonBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: { fontSize: 23 },
  modalImg: {
    width: 55,
    height: 55,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
  },
});

export { commonStyles };
