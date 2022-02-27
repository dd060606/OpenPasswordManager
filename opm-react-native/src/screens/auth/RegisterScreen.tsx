import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Button } from "react-native";
import { withTranslation, WithTranslation } from "react-i18next";

import { Text } from "../../components/OPMComponents";

import type { RegisterProps } from "../../App";

import {
  registerStyles as styles,
  commonStyles,
} from "../../styles/AuthStyles";

type State = {};

class RegisterScreen extends Component<RegisterProps & WithTranslation, State> {
  render() {
    const { t } = this.props;

    return (
      <View style={commonStyles.container}>
        <Text style={commonStyles.title}>{t("auth.signup")}</Text>
        <Button
          title="Go to Login"
          onPress={() => this.props.navigation.navigate("Login")}
        />
        <StatusBar style="auto" />
      </View>
    );
  }
}

export default withTranslation()(RegisterScreen);
