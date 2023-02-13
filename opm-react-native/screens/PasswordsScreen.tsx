import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import type { RootStackScreenProps } from "app/types/types";
import {
  useTranslation,
  withTranslation,
  WithTranslation,
} from "react-i18next";
import {
  SafeAreaView,
  ScrollView,
  Text,
  useThemeColor,
  View,
  Button,
} from "app/components/OPMComponents";
import Input from "app/components/Input";
import { getToken } from "app/utils/Config";
import axios from "axios";
import { API_URL } from "app/config.json";
import type { AxiosCredentialsResponse, Credentials } from "app/types/types";
import { extractRootDomain } from "app/utils/Utils";
import PasswordItem from "app/components/PasswordItem";
import { passwordsStyles as styles } from "app/styles/PasswordsStyles";
import { MaterialIcons } from "@expo/vector-icons";
import PasswordModal from "app/components/PasswordModal";

type State = {
  isLoading: boolean;
  credentials: Credentials[] | undefined;
  searchValue: string;
  errorModal: {
    visible: boolean;
    message: string;
  };
  passwdModal: {
    visible: boolean;
    edit: boolean;
    currentCredentials: Credentials | {};
  };
};

class PasswordsScreen extends Component<
  RootStackScreenProps<"Passwords"> & WithTranslation,
  State
> {
  state = {
    isLoading: true,
    credentials: undefined,
    searchValue: "",
    errorModal: {
      visible: false,
      message: "",
    },
    passwdModal: {
      visible: false,
      edit: true,
      currentCredentials: {},
    },
  };

  componentDidMount() {
    const { isLoading } = this.state;

    if (isLoading) {
      this.updateCredentials();
    }
  }

  updateCredentials = () => {
    const { t } = this.props;
    axios
      .get(`${API_URL}/api/credentials/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((result: AxiosCredentialsResponse) => {
        let finalCredentials = [];
        for (let i = 0; i < result.data.credentials.length; i++) {
          result.data.credentials[
            i
          ].sImageURL = `https://d2erpoudwvue5y.cloudfront.net/_46x30/${extractRootDomain(
            result.data.credentials[i].url
          ).replace(".", "_")}@2x.png`;
          result.data.credentials[
            i
          ].lImageURL = `https://d2erpoudwvue5y.cloudfront.net/_160x106/${extractRootDomain(
            result.data.credentials[i].url
          ).replace(".", "_")}@2x.png`;

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
  };

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
    const { credentials, searchValue, passwdModal } = this.state;
    return (
      <SafeAreaView>
        <View style={styles.topView}>
          <Input
            isValid={true}
            icon={"search"}
            placeholder={t("search")}
            value={searchValue}
            onChangeText={(text) => this.setState({ searchValue: text })}
            autoCorrect={false}
          ></Input>
          <Button
            title={t("passwords.add")}
            onPress={() =>
              this.setState({
                passwdModal: {
                  edit: false,
                  visible: true,
                  currentCredentials: {},
                },
              })
            }
          ></Button>
        </View>
        <ScrollView>
          <View style={{ paddingBottom: 50 }}>
            {credentials &&
              (credentials as Credentials[]).map((credentials, index) => {
                if (!searchValue) {
                  return (
                    <PasswordItem
                      credentials={credentials}
                      key={"password_" + index}
                      onPress={() =>
                        this.setState({
                          passwdModal: {
                            edit: true,
                            visible: true,
                            currentCredentials: credentials,
                          },
                        })
                      }
                    />
                  );
                } else if (
                  credentials.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) ||
                  credentials.username
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
                ) {
                  return (
                    <PasswordItem
                      credentials={credentials}
                      key={"password_" + index}
                      onPress={() =>
                        this.setState({
                          passwdModal: {
                            edit: true,
                            visible: true,
                            currentCredentials: credentials,
                          },
                        })
                      }
                    />
                  );
                }
              })}
            {credentials && (credentials as Credentials[]).length === 0 && (
              <NoPasswordsView />
            )}
          </View>
        </ScrollView>
        <PasswordModal
          edit={passwdModal.edit}
          visible={passwdModal.visible}
          setVisible={(visible) =>
            this.setState({
              passwdModal: {
                visible: visible,
                edit: true,
                currentCredentials: {},
              },
            })
          }
          credentials={passwdModal.currentCredentials}
          sendToLoginScreen={() =>
            this.props.navigation.replace(
              "Login",
              {} as RootStackScreenProps<"Login">
            )
          }
          reloadCredentials={this.updateCredentials}
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}
const NoPasswordsView = () => {
  const { t } = useTranslation();
  const color = useThemeColor({}, "text");
  return (
    <View style={styles.noPasswordsView}>
      <MaterialIcons name="lock-outline" size={150} color={color} />
      <Text style={styles.noPasswordsText}>{t("passwords.no-passwords")}</Text>
    </View>
  );
};
export default withTranslation()(PasswordsScreen);
