import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Button, Image } from "react-native";
import { withTranslation, WithTranslation } from "react-i18next";

import { Text } from "../../components/OPMComponents";
import { Input } from "../../components/Input";

import type { LoginProps } from "../../App";

import { loginStyles as styles, commonStyles } from "../../styles/AuthStyles";

type State = {
  email: string;
  password: string;
};

class LoginScreen extends Component<LoginProps & WithTranslation, State> {
  state = {
    email: "",
    password: "",
  };
  render() {
    const { email, password } = this.state;
    const { t } = this.props;
    return (
      <View style={commonStyles.container}>
        <Image
          style={commonStyles.logo}
          source={require("../../../assets/logo.png")}
        />
        <Text style={commonStyles.title}>{t("auth.login")}</Text>
        <Input placeholder={t("auth.email")} isValid={true} value={email} />
        <Button
          title="Go to register"
          onPress={() => this.props.navigation.navigate("Register")}
        />
        <StatusBar style="auto" />
      </View>
    );
  }
}

export default withTranslation()(LoginScreen);
