import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { withTranslation, WithTranslation } from "react-i18next";

import type { HomeProps } from "@app/App";

type State = {};

class HomeScreen extends Component<HomeProps & WithTranslation, State> {
  render() {
    return (
      <View>
        <StatusBar style="auto" />
      </View>
    );
  }
}

export default withTranslation()(HomeScreen);
