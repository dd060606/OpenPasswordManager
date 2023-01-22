import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import type { RootStackScreenProps } from "app/types/types";
import { withTranslation, WithTranslation } from "react-i18next";
import { SafeAreaView } from "app/components/OPMComponents";

type State = {};

class SettingsScreen extends Component<
  RootStackScreenProps<"Settings"> & WithTranslation,
  State
> {
  state = {};

  render() {
    const { t } = this.props;
    return (
      <SafeAreaView>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}
export default withTranslation()(SettingsScreen);
