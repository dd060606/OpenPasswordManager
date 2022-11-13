import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import type { RootStackScreenProps } from "app/types/types";
import { withTranslation, WithTranslation } from "react-i18next";
import i18n from "app/i18n";
import { SafeAreaView, Text } from "app/components/OPMComponents";
type State = {};

class HomeScreen extends Component<
  RootStackScreenProps<"Passwords"> & WithTranslation,
  State
> {
  state = {};

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView>
        <Text>aaa</Text>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}
export default withTranslation()(HomeScreen);
