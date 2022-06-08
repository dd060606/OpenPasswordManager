import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  View,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import type {
  AxiosError,
  AxiosAuthResponse,
  RootStackScreenProps,
} from "../../types/types";
import { API_URL } from "../../config.json";
import { withTranslation, WithTranslation } from "react-i18next";
import { getImageFromName } from "../../utils/ImageUtils";

import { Text, Button, StyledButton } from "../../components/OPMComponents";
import Input from "../../components/Input";
import EmailConfirmation from "../../components/EmailConfirmation";

import i18n from "../../i18n";

import {
  registerStyles as styles,
  authCommonStyles,
} from "../../styles/AuthStyles";
import { commonStyles } from "../../styles/CommonStyles";
import { setToken } from "../../utils/Config";

type State = {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
  fieldsValid: {
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
    firstname: boolean;
    lastname: boolean;
  };
  errorModal: {
    visible: boolean;
    message: string;
  };
  isAuthenticating: boolean;
  emailConfirmationEnabled: boolean;
};

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&_]{8,}$/;
const lettersRegex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;

class RegisterScreen extends Component<
  RootStackScreenProps<"Register"> & WithTranslation,
  State
> {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    fieldsValid: {
      email: true,
      password: true,
      confirmPassword: true,
      firstname: true,
      lastname: true,
    },
    errorModal: {
      visible: false,
      message: "",
    },
    isAuthenticating: false,
    emailConfirmationEnabled: false,
  };

  handleChangeEmail(newEmail: string) {
    this.setState({
      email: newEmail,
      fieldsValid: {
        ...this.state.fieldsValid,
        email: !newEmail ? true : emailRegex.test(newEmail),
      },
    });
  }

  handleChangePassword = (
    newPassword: string,
    isConfirmPassword: boolean | undefined = false
  ) => {
    const { password } = this.state;
    if (isConfirmPassword) {
      this.setState({
        confirmPassword: newPassword,
        fieldsValid: {
          ...this.state.fieldsValid,
          confirmPassword: !newPassword ? true : newPassword === password,
        },
      });
    } else {
      this.setState({
        password: newPassword,
        fieldsValid: {
          ...this.state.fieldsValid,
          password: !newPassword ? true : passwordRegex.test(newPassword),
        },
      });
    }
  };

  handleChangeName(name: string, isFirstname: boolean) {
    if (isFirstname) {
      this.setState({
        firstname: name,
        fieldsValid: {
          ...this.state.fieldsValid,
          firstname: !name ? true : lettersRegex.test(name),
        },
      });
    } else {
      this.setState({
        lastname: name,
        fieldsValid: {
          ...this.state.fieldsValid,
          lastname: !name ? true : lettersRegex.test(name),
        },
      });
    }
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

  handleRegister = () => {
    const {
      email,
      password,
      confirmPassword,
      firstname,
      lastname,
      isAuthenticating,
    } = this.state;
    const { t } = this.props;

    if (isAuthenticating) {
      return;
    }
    this.setState({ isAuthenticating: true });

    let emailWithoutSpaces: string = email.replace(/\s/g, "");

    if (
      emailWithoutSpaces === "" ||
      password === "" ||
      confirmPassword === "" ||
      firstname === "" ||
      lastname === ""
    ) {
      this.openErrorModal(t("auth.errors.complete-all-fields"));
    } else if (!lettersRegex.test(firstname) || !lettersRegex.test(lastname)) {
      this.openErrorModal(t("auth.errors.invalid-names"));
    } else if (!emailRegex.test(emailWithoutSpaces)) {
      this.openErrorModal(t("auth.errors.invalid-email"));
    } else if (!passwordRegex.test(password)) {
      this.openErrorModal(t("auth.errors.invalid-password"));
    } else if (password !== confirmPassword) {
      this.openErrorModal(t("auth.errors.password-confirmation-not-match"));
    } else {
      axios
        .post(`${API_URL}/api/auth/signup`, {
          lastname: lastname,
          firstname: firstname,
          email: email,
          password: password,
          lang: i18n.language,
        })
        .then(() => {
          this.setState({ isAuthenticating: false });
          this.setState({ emailConfirmationEnabled: true });
          const interval = setInterval(() => {
            axios
              .post(`${API_URL}/api/auth/email/validated`, { email: email })
              .then((res: AxiosAuthResponse) => {
                if (res.data.value === true) {
                  clearInterval(interval);
                  axios
                    .post(`${API_URL}/api/auth/login`, {
                      email: email,
                      password: password,
                    })
                    .then((res: AxiosAuthResponse) => {
                      if (res.data.result === "success") {
                        setToken(res.data.token ? res.data.token : "");

                        this.props.navigation.navigate(
                          "Home",
                          {} as RootStackScreenProps<"Home">
                        );
                      }
                    })
                    .catch(() => {
                      this.props.navigation.navigate(
                        "Login",
                        {} as RootStackScreenProps<"Login">
                      );
                    });
                }
              });
          }, 5000);
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            if (error.response.data.result === "error") {
              if (error.response.data.type === "internal-error") {
                this.openErrorModal(t("errors.internal-error"));
              } else if (error.response.data.type === "email-already-exists") {
                this.openErrorModal(t("auth.errors.email-already-exists"));
              } else {
                this.openErrorModal(error.message);
              }
            }
          } else {
            this.openErrorModal(t("errors.unknown-error"));
          }
          this.setState({ isAuthenticating: false });
        });
    }
  };

  render() {
    const {
      email,
      password,
      confirmPassword,
      fieldsValid,
      errorModal,
      isAuthenticating,
      firstname,
      lastname,
      emailConfirmationEnabled,
    } = this.state;
    const { t } = this.props;
    return (
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
        <Text style={authCommonStyles.title}>{t("auth.signup")}</Text>

        {!emailConfirmationEnabled && (
          <>
            <View style={styles.nameContainer}>
              <Input
                placeholder={t("auth.firstname")}
                isValid={fieldsValid.firstname}
                value={firstname}
                onChangeText={(text) => this.handleChangeName(text, true)}
                icon={"id-badge"}
                smallInput={true}
              />
              <Input
                placeholder={t("auth.lastname")}
                isValid={fieldsValid.lastname}
                value={lastname}
                onChangeText={(text) => this.handleChangeName(text, false)}
                icon={"id-badge"}
                smallInput={true}
              />
            </View>
            <Input
              placeholder={t("auth.email")}
              isValid={fieldsValid.email}
              value={email}
              onChangeText={(text) => this.handleChangeEmail(text)}
              icon={"user"}
            />
            <Input
              placeholder={t("auth.password")}
              isValid={fieldsValid.password}
              value={password}
              onChangeText={(text) => this.handleChangePassword(text)}
              password={true}
              icon={"lock"}
            />
            <Input
              placeholder={t("auth.confirm-password")}
              isValid={fieldsValid.confirmPassword}
              value={confirmPassword}
              onChangeText={(text) => this.handleChangePassword(text, true)}
              password={true}
              icon={"lock"}
            />

            <Button
              title={t("auth.signup")}
              onPress={this.handleRegister}
              JSX={
                isAuthenticating ? (
                  <ActivityIndicator size={25} color="#fff" />
                ) : undefined
              }
            />

            <StyledButton
              title={t("auth.already-have-account")}
              onPress={() =>
                this.props.navigation.navigate(
                  "Login",
                  {} as RootStackScreenProps<"Login">
                )
              }
              textStyle={authCommonStyles.link}
            />
            <Modal
              animationType="fade"
              transparent={true}
              visible={errorModal.visible}
              onRequestClose={() => {
                this.setState({
                  errorModal: { ...errorModal, visible: false },
                });
              }}
            >
              <View style={commonStyles.centeredView}>
                <View style={commonStyles.modalView}>
                  <Image
                    style={commonStyles.modalImg}
                    source={getImageFromName("error")}
                  />
                  <Text style={commonStyles.modalTitle}>{t("error")}</Text>

                  <Text style={commonStyles.modalText}>
                    {errorModal.message}
                  </Text>
                  <Button
                    onPress={() =>
                      this.setState({
                        errorModal: { ...errorModal, visible: false },
                      })
                    }
                    style={commonStyles.modalButton}
                    textStyle={commonStyles.modalButtonText}
                    title={t("ok")}
                  />
                </View>
              </View>
            </Modal>
          </>
        )}
        {emailConfirmationEnabled && <EmailConfirmation email={email} />}
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    );
  }
}
export default withTranslation()(RegisterScreen);
