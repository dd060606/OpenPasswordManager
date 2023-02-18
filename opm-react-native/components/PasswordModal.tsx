import { commonStyles } from "app/styles/CommonStyles";
import { authCommonStyles } from "app/styles/AuthStyles";
import { Credentials } from "app/types/types";
import { getImageFromName } from "app/utils/ImageUtils";
import { Component } from "react";
import Input from "./Input";
import { WithTranslation, withTranslation } from "react-i18next";
import {
  Modal,
  Image,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Button,
  useThemeColor,
  View as ThemedView,
  Text,
  StyledButton,
} from "./OPMComponents";
import { ConfirmModal, ErrorModal } from "./Modals";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "app/config.json";
import CryptoES from "crypto-es";

import { getPassword, getToken } from "app/utils/Config";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  edit: boolean;
  credentials: Credentials | {};
  sendToLoginScreen: () => void;
  reloadCredentials: () => void;
};
type State = {
  showPassword: boolean;
  password: string;
  url: string;
  websiteName: string;
  username: string;
  passwordLength: number;
  numbersEnabled: boolean;
  lowercasesEnabled: boolean;
  uppercaseEnabled: boolean;
  symbolsEnabled: boolean;
  generatedPassword: string;
  generatePasswordBoxOpened: boolean;
  errorModal: {
    visible: boolean;
    message: string;
  };
  confirmModal: {
    visible: boolean;
    message: string;
  };
  imgError: boolean;
};
class PasswordModal extends Component<Props & WithTranslation, State> {
  state = {
    showPassword: false,
    password: "",
    url: "",
    websiteName: "",
    username: "",
    passwordLength: 20,
    numbersEnabled: true,
    lowercasesEnabled: true,
    uppercaseEnabled: true,
    symbolsEnabled: true,
    generatedPassword: "",
    generatePasswordBoxOpened: false,
    errorModal: {
      visible: false,
      message: "",
    },
    confirmModal: {
      visible: false,
      message: "",
    },
    imgError: false,
  };

  loadCurrentCredentials = () => {
    const { credentials } = this.props;
    if (JSON.stringify(credentials) !== "{}") {
      let creds = credentials as Credentials;
      this.setState({
        url: creds.url,
        websiteName: creds.name,
        username: creds.username,
        password: CryptoES.AES.decrypt(creds.password, getPassword()).toString(
          CryptoES.enc.Utf8
        ),
      });
    }
  };

  openErrorModal = (message: string) => {
    this.setState({
      errorModal: {
        message: message,
        visible: true,
      },
    });
  };

  handleAddPassword = () => {
    const { websiteName, password, username, url } = this.state;
    const { t } = this.props;

    if (!websiteName) {
      this.openErrorModal(t("errors.enter-website-name"));
      return;
    }
    let encryptedPassword = CryptoES.AES.encrypt(
      password,
      getPassword()
    ).toString();
    axios
      .post(
        `${API_URL}/api/credentials/add/`,
        {
          username: username,
          password: encryptedPassword,
          name: websiteName,
          url: url
            ? url.startsWith("http://") || url.startsWith("https://")
              ? url
              : `https://${url}`
            : "",
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      )
      .then(() => {
        this.props.setVisible(false);
        this.props.reloadCredentials();
      })
      .catch((err) => {
        let errorMessage = t("errors.unknown-error");
        if (err.response && err.response.data) {
          if (err.response.data.type === "internal-error") {
            errorMessage = t("errors.internal-error");
          } else if (err.response.data.type === "invalid-token") {
            this.props.sendToLoginScreen();
            return;
          }
        }
        this.openErrorModal(errorMessage);
      });
  };
  handleEditPassword = () => {
    const { websiteName, password, username, url } = this.state;
    const { t, credentials } = this.props;

    if (!websiteName) {
      this.openErrorModal(t("errors.enter-website-name"));
      return;
    }
    let encryptedPassword = CryptoES.AES.encrypt(
      password,
      getPassword()
    ).toString();

    axios
      .put(
        `${API_URL}/api/credentials/edit/${(credentials as Credentials).id}`,
        {
          username: username,
          password: encryptedPassword,
          name: websiteName,
          url:
            url.startsWith("http://") || url.startsWith("https://")
              ? url
              : `https://${url}`,
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      )
      .then(() => {
        this.props.setVisible(false);
        this.props.reloadCredentials();
      })
      .catch((err) => {
        let errorMessage = t("errors.unknown-error");
        if (err.response && err.response.data) {
          if (err.response.data.type === "internal-error") {
            errorMessage = t("errors.internal-error");
          } else if (err.response.data.type === "invalid-token") {
            this.props.sendToLoginScreen();
            return;
          }
        }

        this.openErrorModal(errorMessage);
      });
  };
  handleDeleteCredentials = () => {
    const { t, credentials } = this.props;

    axios
      .delete(
        `${API_URL}/api/credentials/delete/${(credentials as Credentials).id}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      )
      .then(() => {
        this.props.setVisible(false);
        this.props.reloadCredentials();
      })
      .catch((err) => {
        let errorMessage = t("errors.unknown-error");
        if (err.response && err.response.data) {
          if (err.response.data.type === "internal-error") {
            errorMessage = t("errors.internal-error");
          } else if (err.response.data.type === "invalid-token") {
            this.props.sendToLoginScreen();
            return;
          }
        }

        this.openErrorModal(errorMessage);
      });
  };
  openDeleteConfirmBox = () => {
    const { t } = this.props;
    this.setState({
      confirmModal: {
        message: t("passwords.delete-password"),
        visible: true,
      },
    });
  };

  setVisible = (visible: boolean) => {
    this.setState({
      imgError: false,
      url: "",
      password: "",
      websiteName: "",
      username: "",
    });
    this.props.setVisible(visible);
  };

  render() {
    const { visible, t, credentials, edit } = this.props;
    const {
      websiteName,
      url,
      username,
      password,
      errorModal,
      confirmModal,
      imgError,
    } = this.state;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => this.setVisible(false)}
        onShow={this.loadCurrentCredentials}
      >
        <View style={commonStyles.centeredView}>
          <ThemedView
            style={[commonStyles.modalView, style.modalView]}
            darkColor={"#3D3D3D"}
          >
            {edit && Object.keys(credentials).length !== 0 && (
              <View style={style.logoView}>
                {!imgError && (
                  <Image
                    source={{ uri: (credentials as Credentials).lImageURL }}
                    style={style.image}
                    onError={() => this.setState({ imgError: true })}
                  />
                )}
                {imgError && (
                  <View style={style.logoErrorView}>
                    <Text style={style.logoText}>
                      {websiteName.substring(0, 2)}
                    </Text>
                  </View>
                )}

                <Text style={style.modalSiteName}>
                  {(credentials as Credentials).name}
                </Text>
              </View>
            )}
            {!edit && (
              <Text style={style.modalTitle}>
                {t("passwords.add-password")}
              </Text>
            )}
            <View style={style.fieldBox}>
              <Text style={style.modalText}>
                {t("passwords.website-name")}:
              </Text>
              <Input
                placeholder={t("passwords.website-name")}
                isValid={true}
                value={websiteName}
                onChangeText={(text) => this.setState({ websiteName: text })}
                autoCorrect={false}
                darkColor={"#000"}
              />
              <Text style={style.modalText}>{t("passwords.website")}:</Text>
              <Input
                placeholder={t("passwords.add-url")}
                isValid={true}
                value={url}
                onChangeText={(text) => this.setState({ url: text })}
                autoCorrect={false}
                darkColor={"#000"}
              />
              <Text style={style.modalText}>{t("passwords.username")}:</Text>
              <Input
                placeholder={t("passwords.username")}
                isValid={true}
                value={username}
                onChangeText={(text) => this.setState({ username: text })}
                keyboardType={"email-address"}
                autoCorrect={false}
                darkColor={"#000"}
              />
              <Text style={style.modalText}>{t("auth.password")}:</Text>
              <Input
                placeholder={t("auth.password")}
                isValid={true}
                value={password}
                onChangeText={(text) => this.setState({ password: text })}
                password={true}
                autoCorrect={false}
                icon={"lock"}
                darkColor={"#000"}
              />
            </View>
            <View style={style.buttonBox}>
              <Button
                onPress={() =>
                  edit ? this.handleEditPassword() : this.handleAddPassword()
                }
                style={style.modalButton}
                textStyle={style.modalButtonText}
                title={edit ? t("passwords.save") : t("passwords.add")}
              />
              <Button
                onPress={() => this.setVisible(false)}
                style={style.modalButton}
                textStyle={style.modalButtonText}
                title={t("cancel")}
              />
              {edit && (
                <StyledButton
                  onPress={this.openDeleteConfirmBox}
                  style={[style.trashButton]}
                  textStyle={style.modalButtonText}
                  title={""}
                  JSX={
                    <FontAwesome
                      name="trash-o"
                      size={24}
                      style={{ color: "#fff" }}
                    />
                  }
                />
              )}
            </View>
          </ThemedView>
        </View>
        <ErrorModal
          visible={errorModal.visible}
          message={errorModal.message}
          setVisible={(visible) =>
            this.setState({ errorModal: { ...errorModal, visible: visible } })
          }
        />
        <ConfirmModal
          visible={confirmModal.visible}
          message={confirmModal.message}
          onConfirm={() => {
            this.setState({
              confirmModal: { ...confirmModal, visible: false },
            });
            this.handleDeleteCredentials();
          }}
          setVisible={(visible) =>
            this.setState({
              confirmModal: { ...confirmModal, visible: visible },
            })
          }
        />
      </Modal>
    );
  }
}

const style = StyleSheet.create({
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    height: 650,
  },
  image: {
    width: 160,
    height: 106,
    borderRadius: 10,
  },
  logoView: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
  },
  logoErrorView: {
    maxWidth: 160,
    minWidth: 160,
    minHeight: 106,
    maxHeight: 106,
    borderRadius: 20,
    backgroundColor: "#54c2f0",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
  },
  buttonBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    padding: 0,
    maxHeight: 100,
    alignItems: "center",
    marginTop: 10,
  },
  modalButton: {
    padding: 0,
    height: 50,
    marginRight: 5,
    marginLeft: 5,
  },
  trashButton: {
    padding: 10,
    borderWidth: 1,
    height: 50,
    width: 50,
    alignItems: "center",
    backgroundColor: "#F04B1F",
    borderRadius: 5,
  },
  modalButtonText: {
    fontSize: 18,
  },
  modalTitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  modalSiteName: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },
  modalText: {
    fontSize: 17,
    marginTop: 15,
  },
  fieldBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
});

export default withTranslation()(PasswordModal);
