import { Component } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { withTranslation, WithTranslation } from "react-i18next";
import { getImageFromName } from "app/utils/ImageUtils";

import {
  getOfflineDB,
  getProtected,
  getSecure,
  isBiometricAuth,
  saveSecure,
  setOfflineMode,
  setPassword,
  setToken,
} from "app/utils/Config";

import type {
  RootStackScreenProps,
  AxiosAuthResponse,
  AxiosError,
  Credentials,
} from "app/types/types";

import { authCommonStyles } from "app/styles/AuthStyles";
import {
  Text,
  Button,
  StyledButton,
  SafeAreaView,
  StatusBar,
} from "app/components/OPMComponents";
import { ConfirmModal, ErrorModal } from "app/components/Modals";
import Input from "app/components/Input";

import CryptoES from "crypto-es";
import { login } from "app/utils/APIUtils";
import { MaterialIcons } from "@expo/vector-icons";

type State = {
  email: string;
  password: string;
  fieldsValid: {
    email: boolean;
    password: boolean;
  };
  errorModal: {
    visible: boolean;
    message: string;
  };
  confirmModal: {
    visible: boolean;
    message: string;
  };
  isAuthenticating: boolean;
  showBiometricButton: boolean;
};

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&_]{8,}$/;

class LoginScreen extends Component<
  RootStackScreenProps<"Login"> & WithTranslation,
  State
> {
  state = {
    email: "",
    password: "",
    fieldsValid: {
      email: true,
      password: true,
    },
    errorModal: {
      visible: false,
      message: "",
    },
    confirmModal: {
      visible: false,
      message: "",
    },
    isAuthenticating: false,
    showBiometricButton: false,
  };
  componentDidMount() {
    this.loadBiometricAuth();
  }

  loadBiometricAuth = () => {
    getSecure("email").then((email) => {
      if (email && emailRegex.test(email)) {
        this.setState({
          email: email,
          isAuthenticating: true,
          showBiometricButton: false,
        });
        const { t } = this.props;
        if (isBiometricAuth()) {
          getProtected("password", [t("auth.login"), t("cancel")])
            .then((password) => {
              if (password) {
                this.performAuth(email, password);
              } else {
                this.setState({
                  isAuthenticating: false,
                  showBiometricButton: true,
                });
              }
            })
            .catch(() => {
              this.setState({ isAuthenticating: false });
            });
        } else {
          this.setState({ isAuthenticating: false });
        }
      }
    });
  };

  componentWillUnmount() {
    this.setState({ isAuthenticating: false, password: "" });
  }
  handleChangeEmail(newEmail: string) {
    this.setState({
      email: newEmail,
      fieldsValid: {
        ...this.state.fieldsValid,
        email: !newEmail ? true : emailRegex.test(newEmail),
      },
    });
  }

  handleChangePassword(newPassword: string) {
    this.setState({
      password: newPassword,
      fieldsValid: {
        ...this.state.fieldsValid,
        password: !newPassword ? true : passwordRegex.test(newPassword),
      },
    });
  }

  openErrorModal = (message: string) => {
    this.setState({
      errorModal: {
        message: message,
        visible: true,
      },
      isAuthenticating: false,
    });
  };

  performAuth = (email: string, password: string) => {
    const { t } = this.props;
    login(email, password)
      .then((res: AxiosAuthResponse) => {
        if (res.data && res.data.token) {
          this.props.navigation.replace(
            "Home",
            {} as RootStackScreenProps<"Home">
          );
        } else {
          this.setState({ isAuthenticating: false });
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
        let isAccessError = true;
        if (err?.response?.data?.type === "internal-error") {
          this.openErrorModal(t("errors.internal-error"));
        } else if (err?.response?.data?.type === "invalid-credentials") {
          this.openErrorModal(t("auth.errors.invalid-credentials"));
          isAccessError = false;
        } else if (err?.response?.data?.type === "email-not-verified") {
          this.openErrorModal(t("auth.errors.email-not-verified"));
          isAccessError = false;
        } else {
          this.openErrorModal(err.message);
        }
        if (isAccessError && getOfflineDB().length > 0) {
          let failed = false;
          let allEmpty = true;
          try {
            getOfflineDB().forEach((creds) => {
              let pass = CryptoES.AES.decrypt(
                creds.password,
                password
              ).toString(CryptoES.enc.Utf8);
              if (pass !== "") {
                allEmpty = false;
              }
            });
          } catch (err) {
            failed = true;
          }
          if (allEmpty) {
            failed = true;
          }
          if (!failed) {
            setPassword(password);
            this.openConfirmModal(t("auth.enable-offline-mode"));
            return;
          }
        }
      });
  };

  //Arrow fx for binding
  handleLogin = () => {
    const { email, password, isAuthenticating } = this.state;
    const { t } = this.props;

    if (isAuthenticating) {
      return;
    }
    this.setState({ isAuthenticating: true });

    let emailWithoutSpaces: string = email.replace(/\s/g, "");

    if (emailWithoutSpaces === "" || password === "") {
      this.openErrorModal(t("auth.errors.complete-all-fields"));
    } else if (!emailRegex.test(emailWithoutSpaces)) {
      this.openErrorModal(t("auth.errors.invalid-email"));
    } else if (!passwordRegex.test(password)) {
      this.openErrorModal(t("auth.errors.invalid-password"));
    } else {
      this.performAuth(emailWithoutSpaces, password);
    }
  };
  openConfirmModal = (message: string) => {
    this.setState({
      confirmModal: { visible: true, message: message },
      isAuthenticating: false,
    });
  };
  goOfflineMode = () => {
    setOfflineMode(true);
    this.props.navigation.replace("Home", {} as RootStackScreenProps<"Home">);
  };

  render() {
    const {
      email,
      password,
      fieldsValid,
      errorModal,
      confirmModal,
      isAuthenticating,
      showBiometricButton,
    } = this.state;
    const { t } = this.props;
    return (
      <SafeAreaView>
        <KeyboardAvoidingView
          style={authCommonStyles.container}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
          enabled={Platform.OS === "ios" ? true : false}
        >
          <Image
            style={authCommonStyles.logo}
            source={getImageFromName("logo")}
          />
          <Text style={authCommonStyles.title}>{t("auth.login")}</Text>
          <Input
            placeholder={t("auth.email")}
            isValid={fieldsValid.email}
            value={email}
            onChangeText={(text) => this.handleChangeEmail(text)}
            autoCorrect={false}
            icon={"user"}
            keyboardType={"email-address"}
            style={authCommonStyles.input}
          />
          <Input
            placeholder={t("auth.password")}
            isValid={fieldsValid.password}
            value={password}
            onChangeText={(text) => this.handleChangePassword(text)}
            autoCorrect={false}
            password={true}
            icon={"lock"}
            style={authCommonStyles.input}
          />

          <Button
            title={t("auth.login")}
            onPress={this.handleLogin}
            JSX={
              isAuthenticating ? (
                <ActivityIndicator size={25} color="#fff" />
              ) : undefined
            }
          />
          {showBiometricButton && (
            <Button
              onPress={this.loadBiometricAuth}
              title=""
              JSX={<MaterialIcons name="fingerprint" size={30} color="white" />}
            />
          )}

          <StyledButton
            title={t("auth.no-account")}
            onPress={() =>
              this.props.navigation.navigate(
                "Register",
                {} as RootStackScreenProps<"Register">
              )
            }
            textStyle={authCommonStyles.link}
          />
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
            onConfirm={this.goOfflineMode}
            background={"background2"}
            setVisible={(visible) =>
              this.setState({
                confirmModal: { ...confirmModal, visible: visible },
              })
            }
          />
          <StatusBar />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(LoginScreen);
