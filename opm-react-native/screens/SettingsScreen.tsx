import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import type { RootStackScreenProps } from "app/types/types";
import { withTranslation, WithTranslation } from "react-i18next";
import { SafeAreaView, Text, View } from "app/components/OPMComponents";
import { settingsStyle as style } from "app/styles/SettingsStyle";
import { RadioButton, Switch } from "react-native-paper";
import {
  getSettings,
  getTheme,
  isBiometricAuth,
  setBiometricAuth,
  setTheme,
} from "app/utils/Config";

type State = {
  theme: string;
  biometricAuth: boolean;
};

class SettingsScreen extends Component<
  RootStackScreenProps<"Settings"> & WithTranslation,
  State
> {
  state = {
    theme: "auto",
    biometricAuth: true,
  };
  componentDidMount() {
    this.setState({ theme: getTheme(), biometricAuth: isBiometricAuth() });
  }

  setTheme = (theme: string) => {
    setTheme(theme);
    this.setState({ theme: theme });
  };
  setBiometricAuth = (enabled: boolean) => {
    setBiometricAuth(enabled);
    this.setState({ biometricAuth: enabled });
  };

  render() {
    const { t } = this.props;
    const { theme, biometricAuth } = this.state;
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
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}
export default withTranslation()(SettingsScreen);
