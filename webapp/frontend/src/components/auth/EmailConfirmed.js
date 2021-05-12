import { Component } from "react"
import "./css/EmailConfirmed.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import i18n from 'i18next'

import { Link } from "react-router-dom"
import axios from "axios"



class EmailConfirmed extends Component {

    state = {
        confirmationFailed: false,
        email: "",
        isRedirectedAfterLogin: false
    }

    componentDidMount() {
        const token = this.props.match.params.token

        if (this.props.location.state && this.props.location.state.redirectedAfterLogin) {
            this.setState({ isRedirectedAfterLogin: true, email: this.props.location.state.email })
            let interval = setInterval(() => {
                axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/email/validated`, { email: this.props.location.state.email })
                    .then(res => {
                        if (res.data.value === true) {
                            clearInterval(interval)
                            this.props.history.push({
                                pathname: "/", state: {
                                    token: token
                                }
                            })
                        }
                    })
            }, 5000)
            return
        }

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
    handleResendEmail = event => {
        const { email } = this.state
        event.target.disabled = true
        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/email/resend`,
            {
                email: email,
                lang: i18n.language
            }
        )
        setTimeout(function () {
            event.target.disabled = false
        }, 30000)
    }
    render() {
        const { t } = this.props;
        const { confirmationFailed, email, isRedirectedAfterLogin } = this.state

        return (
            <div className="email-confirmed">
                <div className="box">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/icon.png`} alt="icon" className="icon" width={50} height={60} />

                    <h2>{t("auth.account-confirmation")}</h2>
                    {!confirmationFailed &&
                        <p><strong>{email}</strong></p>
                    }

                    <p>{t(isRedirectedAfterLogin ? "auth.confirm-email-to-continue" : !confirmationFailed ? "auth.account-successfully-activated" : "errors.account-confirmation-failed")}</p>
                    {!isRedirectedAfterLogin && !confirmationFailed &&
                        <Link className="continue-btn" to="/">
                            {t("continue")}
                        </Link>
                    }
                    {!isRedirectedAfterLogin && confirmationFailed &&
                        <Link className="login-btn" to="/auth/login">
                            {t("auth.login")}
                        </Link>
                    }
                    {isRedirectedAfterLogin &&
                        <button className="resend-email" onClick={(event) => this.handleResendEmail(event)}>{t("auth.resend-email")}</button>
                    }

                </div>

            </div>
        )
    }
}


export default withTranslation()(EmailConfirmed)