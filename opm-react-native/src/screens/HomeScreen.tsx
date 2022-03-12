import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { withTranslation, WithTranslation } from "react-i18next";
import NavMenu from "@app/components/NavMenu";
import {
  Text,
  StyledButton,
  SafeAreaView,
} from "@app/components/OPMComponents";
import { homeStyles as styles } from "@app/styles/HomeStyles";

import type { HomeProps } from "@app/App";

type State = {};

class HomeScreen extends Component<HomeProps & WithTranslation, State> {
  render() {
    return (
      <SafeAreaView>
        <NavMenu navigation={this.props.navigation}>
          <Text>Heuy</Text>
        </NavMenu>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(HomeScreen);
