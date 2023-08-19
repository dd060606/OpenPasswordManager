import { Component } from "react";

import { Text, StyledButton } from "./OPMComponents";
import { emailConfirmationStyles as styles } from "../styles/AuthStyles";

import { withTranslation, WithTranslation } from "react-i18next";
import i18n from "../i18n";
import { resendEmail } from "app/utils/APIUtils";

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
      resendEmail(email, i18n.language);
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
          disabled={true}
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
