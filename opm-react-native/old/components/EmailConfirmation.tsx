import { Component } from "react";

import { Text, StyledButton } from "@app/components/OPMComponents";
import { emailConfirmationStyles as styles } from "@app/styles/AuthStyles";

import { withTranslation, WithTranslation } from "react-i18next";
import axios from "axios";
import i18n from "@app/i18n";
import { API_URL } from "@env";

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
