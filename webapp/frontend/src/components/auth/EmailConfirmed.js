import { Component } from "react"
import "./css/EmailConfirmed.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import { Link } from "react-router-dom"
import axios from "axios"



class EmailConfirmed extends Component {

    state = {
        confirmationFailed: false,
        email: ""
    }

    componentDidMount() {
        const token = this.props.match.params.token
        if (token === undefined) {
            this.setState({ confirmationFailed: true })
        }
        else {
            axios.put(`${process.env.REACT_APP_SERVER_URL}/api/auth/email/confirmation/`, { token: token })
                .then(res => {
                    this.setState({ confirmationFailed: false, email: res.data.email })
                })
                .catch(err => {
                    this.setState({ confirmationFailed: true })
                })

        }
    }
    render() {
        const { t } = this.props;
        const { confirmationFailed, email } = this.state

        return (
            <div className="email-confirmed">
                <div className="box">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/icon.png`} alt="icon" className="icon" width={50} height={60} />

                    <h2>{t("auth.account-confirmation")}</h2>
                    {!confirmationFailed &&
                        <p><strong>{email}</strong></p>
                    }
                    <p>{t(!confirmationFailed ? "auth.account-successfully-activated" : "errors.account-confirmation-failed")}</p>
                    {!confirmationFailed &&
                        <Link className="continue-btn" to="/">
                            {t("continue")}
                        </Link>
                    }
                    {confirmationFailed &&
                        <Link className="login-btn" to="/auth/login">
                            {t("auth.login")}
                        </Link>
                    }

                </div>

            </div>
        )
    }
}


export default withTranslation()(EmailConfirmed)