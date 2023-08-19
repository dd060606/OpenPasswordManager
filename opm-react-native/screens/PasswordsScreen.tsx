import { Component, useState } from "react";
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
  StatusBar,
} from "app/components/OPMComponents";
import Input from "app/components/Input";
import {
  getOfflineDB,
  getSortValue,
  isOfflineMode,
  setOfflineDB,
  setOfflineMode,
  setPassword,
  setSortValue,
} from "app/utils/Config";

import type { Credentials } from "app/types/types";
import { getTimeInSecond, sortCredentials } from "app/utils/Utils";
import PasswordItem from "app/components/PasswordItem";
import { passwordsStyles as styles } from "app/styles/PasswordsStyles";
import { MaterialIcons } from "@expo/vector-icons";
import PasswordModal from "app/components/PasswordModal";
import { AppState, NativeEventSubscription } from "react-native";
import { getCredentials } from "app/utils/APIUtils";

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
  sortValue: number;
};

class PasswordsScreen extends Component<
  RootStackScreenProps<"Passwords"> & WithTranslation,
  State
> {
  private appStateSubscription?: NativeEventSubscription;
  private appBackgroundTime = 0;

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
    sortValue: 2,
  };

  componentDidMount() {
    const { isLoading } = this.state;
    this.props.navigation.addListener("blur", () => {
      this.setState({ searchValue: "" });
    });
    this.appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState.match(/inactive|background/)) {
          this.appBackgroundTime = getTimeInSecond();
        } else if (nextAppState.match(/active/)) {
          if (
            this.appBackgroundTime !== 0 &&
            getTimeInSecond() >= this.appBackgroundTime + 60 * 5
          ) {
            setPassword("");
            setOfflineMode(false);
            this.props.navigation.replace(
              "Login",
              {} as RootStackScreenProps<"Login">
            );
          }
        }
      }
    );
    if (isLoading) {
      const sortVal =
        getSortValue() === null || getSortValue() === undefined
          ? 2
          : getSortValue();
      this.setState({
        sortValue: sortVal,
      });
      this.updateCredentials(sortVal);
    }
  }

  componentWillUnmount() {
    this.appStateSubscription?.remove();
    this.props.navigation.removeListener("blur", () => {});
  }
  updateCredentials = (sortValue: number) => {
    const { t } = this.props;
    if (isOfflineMode()) {
      this.setState({
        isLoading: false,
        credentials: sortCredentials(getOfflineDB(), sortValue),
      });
    } else {
      getCredentials()
        .then((credentials) => {
          const sortedCreds = sortCredentials(credentials, sortValue);
          this.setState({
            isLoading: false,
            credentials: sortedCreds,
          });
          setOfflineDB(sortedCreds);
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
  };

  handleSortClick = () => {
    const { sortValue, credentials } = this.state;
    let newSortVal = 0;
    if (sortValue < 2) {
      newSortVal = sortValue + 1;
    }
    setSortValue(newSortVal);
    this.setState({
      sortValue: newSortVal,
      credentials: sortCredentials(credentials as any, newSortVal),
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

  isSearchResultEmpty = () => {
    const { credentials, searchValue } = this.state;
    let isSearchResEmpty = true;

    if (searchValue && credentials) {
      (credentials as Credentials[]).forEach((creds) => {
        if (
          creds.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          creds.username.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          isSearchResEmpty = false;
        }
      });
    } else {
      isSearchResEmpty = false;
    }
    return isSearchResEmpty;
  };

  render() {
    const { t } = this.props;
    const { credentials, searchValue, passwdModal, sortValue } = this.state;

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
          <Button
            title={t("settings.sortval", { returnObjects: true })[sortValue]}
            onPress={this.handleSortClick}
            style={styles.sortButton}
            textStyle={styles.sortButtonText}
          ></Button>
        </View>
        <ScrollView>
          <View style={{ paddingBottom: 50 }}>
            {this.isSearchResultEmpty() && <SearchResultEmpty />}
            {credentials &&
              !this.isSearchResultEmpty() &&
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
          reloadCredentials={() => this.updateCredentials(sortValue)}
        />
        <StatusBar />
      </SafeAreaView>
    );
  }
}
const NoPasswordsView = () => {
  const { t } = useTranslation();
  const color = useThemeColor({}, "text");
  return (
    <View style={styles.noPasswordsView}>
      <MaterialIcons name="vpn-key" size={100} color={color} />
      <Text style={styles.noPasswordsText}>{t("passwords.no-passwords")}</Text>
    </View>
  );
};
const SearchResultEmpty = () => {
  const { t } = useTranslation();
  const color = useThemeColor({}, "text");
  return (
    <View style={styles.noPasswordsView}>
      <MaterialIcons name="search" size={150} color={color} />
      <Text style={styles.noPasswordsText}>{t("passwords.no-results")}</Text>
    </View>
  );
};

export default withTranslation()(PasswordsScreen);
