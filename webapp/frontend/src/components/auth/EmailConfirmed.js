import { Component } from "react"
import "./css/EmailConfirmed.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"

class EmailConfirmed extends Component {



    render() {
        const { t } = this.props;

        return (
            <div className="email-confirmed">
                <div className="box">
                    <h2>{t("auth.account-confirmation")}</h2>
                    <p>{t("auth.account-successfully-activated")}</p>
                    <button className="continue-btn"></button>
                </div>

            </div>
        )
    }
}


export default withTranslation()(EmailConfirmed)