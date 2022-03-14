import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { withTranslation, WithTranslation } from "react-i18next";
import NavMenu from "@app/components/NavMenu";
import { Text, SafeAreaView } from "@app/components/OPMComponents";
import Loading from "@app/components/Loading";

import type { HomeProps } from "@app/App";
import axios from "axios";
import { getToken, isTokenValid } from "@app/utils/Config";

type Credentials = {};
type State = { isLoading: boolean };

class HomeScreen extends Component<HomeProps & WithTranslation, State> {
  state = {
    isLoading: true,
  };

  componentDidMount() {
    if (isTokenValid()) {
    } else {
      this.props.navigation.navigate("Login");
    }
  }
  render() {
    const { isLoading } = this.state;
    return (
      <SafeAreaView>
        {!isLoading ? (
          <NavMenu navigation={this.props.navigation}>
            <Text>Home</Text>
          </NavMenu>
        ) : (
          <Loading />
        )}

        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}

export default withTranslation()(HomeScreen);
