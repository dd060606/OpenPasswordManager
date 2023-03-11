import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import type { RootStackScreenProps } from "app/types/types";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  SafeAreaView,
  StyledButton,
  Text,
  View,
} from "app/components/OPMComponents";
import { settingsStyle as style } from "app/styles/SettingsStyle";
import { RadioButton, Switch } from "react-native-paper";
import {
  getSettings,
  getTheme,
  isBiometricAuth,
  saveSecure,
  setBiometricAuth,
  setPassword,
  setTheme,
  setToken,
} from "app/utils/Config";
import Constants from "expo-constants";
import { ConfirmModal } from "app/components/Modals";

type State = {
  theme: string;
  biometricAuth: boolean;
  confirmModal: {
    visible: boolean;
    message: string;
  };
};

class SettingsScreen extends Component<
  RootStackScreenProps<"Settings"> & WithTranslation,
  State
> {
  state = {
    theme: "auto",
    biometricAuth: true,
    confirmModal: {
      visible: false,
      message: "",
    },
  };
  componentDidMount() {
    const theme =
      getTheme() === "" || getTheme() === undefined || getTheme() === null
        ? "auto"
        : getTheme();
    this.setState({ theme: theme, biometricAuth: isBiometricAuth() });
  }

  setTheme = (theme: string) => {
    setTheme(theme);
    this.setState({ theme: theme });
  };
  setBiometricAuth = (enabled: boolean) => {
    setBiometricAuth(enabled);
    this.setState({ biometricAuth: enabled });
  };

  handleLogout = () => {
    const { t } = this.props;
    this.setState({
      confirmModal: { visible: true, message: t("auth.logout-confirm") },
    });
  };

  logout = () => {
    setToken("");
    setPassword("");
    saveSecure("email", "");
    saveSecure("password", "");
    this.props.navigation.replace("Login", {} as RootStackScreenProps<"Login">);
  };

  render() {
    const { t } = this.props;
    const { theme, biometricAuth, confirmModal } = this.state;
    return (
      <SafeAreaView style={style.mainContainer}>
        <Text style={style.title}>{t("settings.settings")}</Text>
        <View style={style.settingsContent}>
          <View style={style.category}>
            <Text style={style.categoryName}>{t("settings.themes")}</Text>
            <View style={style.categoryContent}>
              <RadioButton.Group
                onValueChange={(newTheme) => this.setTheme(newTheme)}
                value={theme}
              >
                <View style={style.radioView}>
                  <RadioButton value="auto" color="#54c2f0" />
                  <Text style={style.contentText}>{t("settings.auto")}</Text>
                </View>
                <View style={style.radioView}>
                  <RadioButton value="light" color="#54c2f0" />
                  <Text style={style.contentText}>{t("settings.light")}</Text>
                </View>
                <View style={style.radioView}>
                  <RadioButton value="dark" color="#54c2f0" />
                  <Text style={style.contentText}>{t("settings.dark")}</Text>
                </View>
              </RadioButton.Group>
            </View>
          </View>
          <View style={style.category}>
            <Text style={style.categoryName}>
              {t("settings.login-options")}
            </Text>
            <View style={style.categoryContent}>
              <View style={style.radioView}>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={biometricAuth ? "#54c2f0" : "#f4f3f4"}
                  onValueChange={this.setBiometricAuth}
                  value={biometricAuth}
                />
                <Text style={style.contentText}>
                  {t("settings.biometric-auth")}
                </Text>
              </View>
            </View>
          </View>
          <View style={style.category}>
            <Text style={style.categoryName}>{t("settings.account")}</Text>
            <View style={style.categoryContent}>
              <StyledButton
                style={style.logoutButton}
                title={t("auth.logout")}
                onPress={this.handleLogout}
              ></StyledButton>
            </View>
          </View>
        </View>
        <Text>Version: {Constants.manifest?.version}</Text>
        <ConfirmModal
          visible={confirmModal.visible}
          message={confirmModal.message}
          onConfirm={this.logout}
          background={"background2"}
          setVisible={(visible) =>
            this.setState({
              confirmModal: { ...confirmModal, visible: visible },
            })
          }
        />

        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}
export default withTranslation()(SettingsScreen);
