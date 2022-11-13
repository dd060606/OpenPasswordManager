import { Component } from "react";

import { Text, StyledButton } from "./OPMComponents";
import { emailConfirmationStyles as styles } from "../styles/AuthStyles";

import { withTranslation, WithTranslation } from "react-i18next";
import axios from "axios";
import i18n from "../i18n";
import { API_URL } from "app/config.json";

type Props = {
  email: string;
};
type State = {
  isButtonDisabled: boolean;
};
class EmailConfirmation extends Component<Props & WithTranslation, State> {
  state = {
    isButtonDisabled: false,
  };

  handleResendEmail() {
    const { isButtonDisabled } = this.state;
    if (!isButtonDisabled) {
      const { email } = this.props;
      this.setState({ isButtonDisabled: true });
      axios.post(`${API_URL}/api/auth/email/resend`, {
        email: email,
        lang: i18n.language,
      });
      setTimeout(() => {
        this.setState({ isButtonDisabled: false });
      }, 30000);
    }
  }
  render() {
    const { email, t } = this.props;
    const { isButtonDisabled } = this.state;
    return (
      <>
        <Text style={styles.emailText}>{email}</Text>
        <Text style={styles.confirmEmailText}>
          {t("auth.confirm-email-to-continue")}
        </Text>
        <StyledButton
          onPress={() => this.handleResendEmail()}
          title={t("auth.resend-email")}
          disabled={isButtonDisabled}
          textStyle={{
            ...styles.sendEmailText,
            ...(isButtonDisabled ? { color: "grey" } : {}),
          }}
        />
      </>
    );
  }
}

export default withTranslation()(EmailConfirmation);
