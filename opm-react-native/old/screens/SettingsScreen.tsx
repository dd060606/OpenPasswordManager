import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { withTranslation, WithTranslation } from "react-i18next";
import NavMenu from "@app/components/NavMenu";
import { Text, SafeAreaView } from "@app/components/OPMComponents";

import type { SettingsProps } from "@app/App";

type State = {};

class SettingsScreen extends Component<SettingsProps & WithTranslation, State> {
  render() {
    return (
      <SafeAreaView>
        <NavMenu navigation={this.props.navigation}>
          <Text>Settings</Text>
        </NavMenu>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(SettingsScreen);
