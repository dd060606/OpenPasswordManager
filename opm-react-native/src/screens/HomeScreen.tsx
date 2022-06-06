import { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { withTranslation, WithTranslation } from "react-i18next";
import NavMenu from "@app/components/NavMenu";
import { Text, SafeAreaView, Button } from "@app/components/OPMComponents";
import Loading from "@app/components/Loading";
import { View, Modal, Image } from "react-native";

import type { HomeProps } from "@app/App";
import axios from "axios";
import { getToken, isTokenValid } from "@app/utils/Config";
import { API_URL } from "@env";
import {
  AxiosCredentialsResponse,
  AxiosError,
  Credentials,
} from "@app/utils/Types";
import { getIconFromName } from "@app/utils/ImageUtils";
import { commonStyles } from "@app/styles/CommonStyles";
import CredentialsElement from "@app/components/CredentialsElement";
import { extractRootDomain } from "@app/utils/Utils";

type State = {
  isLoading: boolean;
  credentials: Credentials[] | null;
  errorModal: {
    message: string;
    visible: boolean;
  };
};

class HomeScreen extends Component<HomeProps & WithTranslation, State> {
  state = {
    isLoading: true,
    credentials: null,
    errorModal: {
      message: "",
      visible: false,
    },
  };

  componentDidMount() {
    const { t } = this.props;
    if (isTokenValid()) {
      axios
        .get(`${API_URL}/api/credentials/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        .then((result: AxiosCredentialsResponse) => {
          let finalCredentials: Credentials[] = [];
          for (let i = 0; i < result.data.credentials.length; i++) {
            if (result.data.credentials[i]) {
              let newCredentials: Credentials = result.data.credentials[
                i
              ] as Credentials;

              let domain = extractRootDomain(newCredentials.url);
              domain = domain.replace(/\./g, "_");
              newCredentials.sImageURL = `https://d2erpoudwvue5y.cloudfront.net/_46x30/${domain}@2x.png`;
              newCredentials.lImageURL = `https://d2erpoudwvue5y.cloudfront.net/_160x106/${domain}@2x.png`;

              finalCredentials.push(newCredentials);
            }
          }
          this.setState({
            isLoading: false,
            credentials: finalCredentials,
          });
        })
        .catch((err: AxiosError) => {
          console.log(err);
          if (err?.response?.data?.type === "internal-error") {
            this.openErrorModal(t("errors.internal-error"));
          } else if (err?.response?.data?.type === "invalid-token") {
            this.props.navigation.replace("Login");
          } else {
            this.openErrorModal(t("errors.unknown-error"));
          }
        });
    } else {
      this.props.navigation.replace("Login");
    }
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
    const { isLoading, errorModal, credentials } = this.state;
    const { t } = this.props;
    return (
      <SafeAreaView>
        {!isLoading ? (
          <NavMenu navigation={this.props.navigation}>
            <Text>Home</Text>
            {credentials && <CredentialsElement credentials={credentials[0]} />}
            <Modal
              animationType="fade"
              transparent={true}
              visible={errorModal.visible}
              onRequestClose={() => {
                this.setState({
                  errorModal: { ...errorModal, visible: false },
                });
                this.props.navigation.replace("Login");
              }}
            >
              <View style={commonStyles.centeredView}>
                <View style={commonStyles.modalView}>
                  <Image
                    style={commonStyles.modalImg}
                    source={getIconFromName("error")}
                  />
                  <Text style={commonStyles.modalTitle}>{t("error")}</Text>

                  <Text style={commonStyles.modalText}>
                    {errorModal.message}
                  </Text>
                  <Button
                    onPress={() => {
                      this.setState({
                        errorModal: { ...errorModal, visible: false },
                      });
                      this.props.navigation.replace("Login");
                    }}
                    style={commonStyles.modalButton}
                    textStyle={commonStyles.modalButtonText}
                    title={t("ok")}
                  />
                </View>
              </View>
            </Modal>
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
