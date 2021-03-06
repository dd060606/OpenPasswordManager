import { Component } from "react"
import "../css/auth/EmailConfirmed.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import i18n from 'i18next'

import { Link } from "react-router-dom"
import axios from "axios"
import { isDarkTheme } from "../../utils/themes-utils"



class EmailConfirmed extends Component {

    state = {
        confirmationFailed: false,
        email: "",
        isRedirectedAfterLogin: false
    }

    componentDidMount() {
        const token = this.props.match.params.token

        const emailConfirmed = document.querySelector(".email-confirmed")
        emailConfirmed.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        emailConfirmed.style.setProperty("--bg-theme", isDarkTheme() ? "#333" : "white")
        emailConfirmed.style.setProperty("--blue-bg-theme", isDarkTheme() ? "#212121" : "rgba(198,237,240,0.35)")

        if (this.props.location.state && this.props.location.state.redirectedAfterLogin) {
            this.setState({ isRedirectedAfterLogin: true, email: this.props.location.state.email })
            const interval = setInterval(() => {
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
    //Arrow fx for binding

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
                        <Link className="login-btn" to={{
                            pathname: "/", state: {
                                token: this.props.match.params.token
                            }
                        }}>
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