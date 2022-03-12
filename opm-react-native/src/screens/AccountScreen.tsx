import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { withTranslation, WithTranslation } from "react-i18next";
import NavMenu from "@app/components/NavMenu";
import { Text, SafeAreaView } from "@app/components/OPMComponents";

import type { AccountProps } from "@app/App";

type State = {};

class AccountScreen extends Component<AccountProps & WithTranslation, State> {
  render() {
    return (
      <SafeAreaView>
        <NavMenu navigation={this.props.navigation}>
          <Text>Account</Text>
        </NavMenu>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(AccountScreen);
