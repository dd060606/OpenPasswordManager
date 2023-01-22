import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { withTranslation, WithTranslation } from "react-i18next";
import { getImageFromName } from "app/utils/ImageUtils";

import { setToken } from "app/utils/Config";

import type {
  RootStackScreenProps,
  AxiosAuthResponse,
  AxiosError,
} from "app/types/types";

import { authCommonStyles } from "app/styles/AuthStyles";
import {
  Text,
  Button,
  StyledButton,
  SafeAreaView,
} from "app/components/OPMComponents";
import { ErrorModal } from "app/components/Modals";
import Input from "app/components/Input";

import { API_URL } from "app/config.json";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  isAuthenticating: boolean;
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
    isAuthenticating: false,
  };
  componentDidMount() {
    AsyncStorage.getItem("email").then((value) => {
      if (value && emailRegex.test(value)) {
        this.setState({ email: value });
      }
    });
  }
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
      axios
        .post(`${API_URL}/api/auth/login`, {
          email: emailWithoutSpaces,
          password: password,
        })
        .then((res: AxiosAuthResponse) => {
          if (res.data && res.data.token) {
            setToken(res.data.token);
            AsyncStorage.setItem("email", email);
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
          if (err?.response?.data?.type === "internal-error") {
            this.openErrorModal(t("errors.internal-error"));
          } else if (err?.response?.data?.type === "invalid-credentials") {
            this.openErrorModal(t("auth.errors.invalid-credentials"));
          } else if (err?.response?.data?.type === "email-not-verified") {
            this.openErrorModal(t("auth.errors.email-not-verified"));
          } else {
            this.openErrorModal(err.message);
          }
        });
    }
  };

  render() {
    const { email, password, fieldsValid, errorModal, isAuthenticating } =
      this.state;
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

          <StatusBar style="auto" />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(LoginScreen);
