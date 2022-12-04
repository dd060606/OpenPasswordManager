import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import type { RootStackScreenProps } from "app/types/types";
import { withTranslation, WithTranslation } from "react-i18next";
import i18n from "app/i18n";
import { SafeAreaView, Text, View } from "app/components/OPMComponents";
import { getToken } from "app/utils/Config";
import axios from "axios";
import { API_URL } from "app/config.json";
import type { AxiosCredentialsResponse, Credentials } from "app/types/types";
import { extractRootDomain } from "app/utils/Utils";

type State = {
  isLoading: boolean;
  credentials: Credentials[] | undefined;
  errorModal: {
    visible: boolean;
    message: string;
  };
};

class PasswordsScreen extends Component<
  RootStackScreenProps<"Passwords"> & WithTranslation,
  State
> {
  state = {
    isLoading: true,
    credentials: undefined,
    errorModal: {
      visible: false,
      message: "",
    },
  };

  componentDidMount() {
    const { isLoading } = this.state;

    if (isLoading) {
      this.updateCredentials();
    }
  }

  updateCredentials() {
    const { t } = this.props;

    /*
        const availablesSortValues = [0, 1, 2];
    if (
      cookies.get("credentialsSort") &&
      availablesSortValues.includes(parseInt(cookies.get("credentialsSort")))
    ) {
      this.setState({ sortValue: parseInt(cookies.get("credentialsSort")) });
    } else {
      cookies.set("credentialsSort", 2);
    }
  */

    axios
      .get(`${API_URL}/api/credentials/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((result: AxiosCredentialsResponse) => {
        let finalCredentials = [];
        for (let i = 0; i < result.data.credentials.length; i++) {
          result.data.credentials[
            i
          ].sImageURL = `https://logo.clearbit.com/${extractRootDomain(
            result.data.credentials[i].url
          )}?size=50`;
          result.data.credentials[
            i
          ].lImageURL = `https://logo.clearbit.com/${extractRootDomain(
            result.data.credentials[i].url
          )}?size=100`;

          finalCredentials.push(result.data.credentials[i]);
        }

        this.setState({
          isLoading: false,
          credentials: result.data.credentials,
        });
      })
      .catch((err) => {
        let errorMessage = t("errors.unknown-error");
        if (err.response && err.response.data) {
          if (err.response.data.type === "internal-error") {
            errorMessage = t("errors.internal-error");
          } else if (err.response.data.type === "invalid-token") {
            this.props.navigation.replace(
              "Login",
              {} as RootStackScreenProps<"Login">
            );
            return;
          }
        }
        this.setState({ isLoading: false });
        console.log(err);
      });
  }

  openErrorModal = (message: string) => {
    this.setState({
      errorModal: {
        message: message,
        visible: true,
      },
      isLoading: false,
    });
  };

  render() {
    const { t } = this.props;
    const { credentials } = this.state;
    return (
      <SafeAreaView>
        <View>
          {credentials
            ? (credentials as Credentials[]).map((credential, index) => (
                <Text style={{ color: "white" }} key={index}>
                  {credential.name}
                </Text>
              ))
            : ""}
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}
export default withTranslation()(PasswordsScreen);
