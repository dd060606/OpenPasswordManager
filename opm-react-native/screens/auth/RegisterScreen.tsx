import { Component } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  View,
  ActivityIndicator,
} from "react-native";
import type {
  AxiosError,
  AxiosAuthResponse,
  RootStackScreenProps,
} from "app/types/types";
import { withTranslation, WithTranslation } from "react-i18next";
import { getImageFromName } from "app/utils/ImageUtils";

import {
  Text,
  Button,
  StyledButton,
  StatusBar,
} from "app/components/OPMComponents";
import Input from "app/components/Input";
import EmailConfirmation from "app/components/EmailConfirmation";

import i18n from "app/i18n";

import {
  registerStyles as styles,
  authCommonStyles,
} from "app/styles/AuthStyles";
import { commonStyles } from "app/styles/CommonStyles";
import { saveSecure, setPassword, setToken } from "app/utils/Config";
import { ErrorModal } from "app/components/Modals";
import { isEmailValidated, login, register } from "app/utils/APIUtils";

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
      register(email, password, firstname, lastname, i18n.language)
        .then(() => {
          this.setState({ isAuthenticating: false });
          this.setState({ emailConfirmationEnabled: true });
          const interval = setInterval(() => {
            isEmailValidated(email).then((res: AxiosAuthResponse) => {
              if (res.data.value === true) {
                clearInterval(interval);
                login(email, password)
                  .then((res: AxiosAuthResponse) => {
                    if (res.data.result === "success") {
                      this.props.navigation.replace(
                        "Home",
                        {} as RootStackScreenProps<"Home">
                      );
                    }
                  })
                  .catch(() => {
                    this.props.navigation.replace(
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
                style={authCommonStyles.input}
              />
              <Input
                placeholder={t("auth.lastname")}
                isValid={fieldsValid.lastname}
                value={lastname}
                onChangeText={(text) => this.handleChangeName(text, false)}
                icon={"id-badge"}
                smallInput={true}
                style={authCommonStyles.input}
              />
            </View>
            <Input
              placeholder={t("auth.email")}
              isValid={fieldsValid.email}
              value={email}
              onChangeText={(text) => this.handleChangeEmail(text)}
              icon={"user"}
              keyboardType={"email-address"}
              style={authCommonStyles.input}
            />
            <Input
              placeholder={t("auth.password")}
              isValid={fieldsValid.password}
              value={password}
              onChangeText={(text) => this.handleChangePassword(text)}
              password={true}
              icon={"lock"}
              style={authCommonStyles.input}
            />
            <Input
              placeholder={t("auth.confirm-password")}
              isValid={fieldsValid.confirmPassword}
              value={confirmPassword}
              onChangeText={(text) => this.handleChangePassword(text, true)}
              password={true}
              icon={"lock"}
              style={authCommonStyles.input}
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
                this.props.navigation.replace(
                  "Login",
                  {} as RootStackScreenProps<"Login">
                )
              }
              textStyle={authCommonStyles.link}
            />
            <ErrorModal
              visible={errorModal.visible}
              message={errorModal.message}
              setVisible={(visible) =>
                this.setState({
                  errorModal: { ...errorModal, visible: visible },
                })
              }
            />
          </>
        )}
        {emailConfirmationEnabled && <EmailConfirmation email={email} />}
        <StatusBar />
      </KeyboardAvoidingView>
    );
  }
}
export default withTranslation()(RegisterScreen);
