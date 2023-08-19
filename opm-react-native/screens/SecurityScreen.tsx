import { Component } from "react";
import type { RootStackScreenProps } from "app/types/types";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyledButton,
  Text,
  View,
} from "app/components/OPMComponents";
import { securityStyle as style } from "app/styles/SecurityStyles";
import { commonStyles } from "app/styles/CommonStyles";
import SecurityBox from "app/components/SecurityBox";
import { getOfflineDB } from "app/utils/Config";
import { getWeakPasswords } from "app/utils/Utils";

type State = {};

class SecurityScreen extends Component<
  RootStackScreenProps<"Security"> & WithTranslation,
  State
> {
  state = {};
  componentDidMount() {
    this.props.navigation.addListener("focus", this.handleFocus);
  }
  componentWillUnmount() {
    this.props.navigation.removeListener("focus", this.handleFocus);
  }
  handleFocus = () => {
    this.setState({});
  };

  render() {
    const { t } = this.props;
    const {} = this.state;
    let weakPasswords = false;
    if (getOfflineDB() && getWeakPasswords(getOfflineDB())?.length > 0) {
      weakPasswords = true;
    }
    return (
      <SafeAreaView style={commonStyles.mainContainer}>
        <Text style={commonStyles.title}>{t("security.security")}</Text>
        <View style={style.securityContent}>
          <Text style={style.categoryName}>{t("security.weak-passwords")}</Text>
          {!weakPasswords && (
            <Text style={style.text}>{t("security.no-weak-passwords")}</Text>
          )}
          {weakPasswords && (
            <ScrollView contentContainerStyle={style.scrollView}>
              {getWeakPasswords(getOfflineDB()).map((credentials, index) => {
                return (
                  <SecurityBox
                    creds={credentials.credentials}
                    passwordStrength={credentials.strength}
                    key={"security_creds" + index}
                  />
                );
              })}
            </ScrollView>
          )}
        </View>
        <StatusBar />
      </SafeAreaView>
    );
  }
}
export default withTranslation()(SecurityScreen);
