import { Component } from "react"
import "../css/auth/Login.css"
import Swal from 'sweetalert2'
import { Link } from "react-router-dom"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import { getEmail, isEmailSaved, saveEmail } from "../../utils/auth-utils"
import { isDarkTheme } from "../../utils/themes-utils"


class Login extends Component {


    state = {
        email: "",
        password: "",
        emailFieldFocused: false,
        passwordFieldFocused: false,
        isConnecting: false,
        showPassword: false,
        isEmailValid: true,
        isPasswordValid: true,
        isEmailSaved: false
    }

    componentDidMount() {


        this.setState({ isEmailSaved: isEmailSaved(), email: isEmailSaved() ? getEmail() : "" })
        const authLogin = document.querySelector(".auth-login")
        authLogin.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        authLogin.style.setProperty("--bg-theme", isDarkTheme() ? "#212121" : "white")
        authLogin.style.setProperty("--bg-2-theme", isDarkTheme() ? "#333" : "white")
        authLogin.style.setProperty("--field-bg-theme", isDarkTheme() ? "#333" : "rgba(236, 236, 236, 0.8)")
        authLogin.style.setProperty("--blue-bg-theme", isDarkTheme() ? "#333" : "rgba(198,237,240,0.35)")

        window.ipc.receive("loginSuccess", () => this.props.history.push("/"))
        window.ipc.receive("loginError", err => {
            const { t } = this.props

            if (err) {
                if (err === "wrong-password") {
                    this.openErrorBox(t("errors.wrong-password"))
                }
                else if (err.type === "internal-error") {
                    this.openErrorBox(t("errors.internal-error"), true)
                } else if (err.type === "invalid-credentials") {
                    this.openErrorBox(t("errors.invalid-credentials"))
                }
                else if (err.type === "email-not-verified") {
                    Swal.fire({
                        title: t("errors.error"),
                        html: `${t("errors.unconfirmed-email")}<br /><span class='email-link'>${t("click-here")}</span> ${t("auth.to-confirm-email")}`,
                        icon: "error",
                        confirmButtonColor: "#54c2f0",
                        background: isDarkTheme() ? " #333" : "white"
                    }
                    ).then(() => {
                        this.setState({ isConnecting: false })
                    })
                    const swal2 = document.querySelectorAll("#swal2-title, #swal2-content")
                    swal2.forEach(element => {
                        element.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
                    })
                    const emailLink = document.querySelector(".email-link")
                    emailLink.addEventListener("click", function () {
                        window.ipc.send("openEmailLink")
                    })
                }
                else {
                    this.openErrorBox(t("errors.unknown-error"), true)
                }
            }
            else {
                this.openErrorBox(t("errors.unknown-error"), true)
            }
        })
        window.ipc.receive("goToAuth", () => this.props.history.push("/auth/login"))


    }

    //Arrow fx for binding

    handleEmailChange = event => {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        this.setState({ email: event.target.value, isEmailValid: event.target.value === "" ? true : emailRegex.test(event.target.value) })
    }
    handlePasswordChange = event => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&_]{8,}$/
        this.setState({ password: event.target.value, isPasswordValid: event.target.value === "" ? true : passwordRegex.test(event.target.value) })
    }

    openErrorBox(message, askOfflineMode = false) {
        const { password } = this.state
        const { t } = this.props
        if (askOfflineMode) {
            Swal.fire({
                title: t("errors.error"),
                text: message,
                icon: "error",
                confirmButtonColor: "#54c2f0",
                showCancelButton: true,
                cancelButtonText: t("cancel"),
                confirmButtonText: t("go-to-offline-mode"),
                background: isDarkTheme() ? " #333" : "white"
            }
            ).then(result => {
                if (result.isConfirmed) {
                    window.ipc.send("goToOfflineMode", password)
                }
                else {
                    this.setState({ isConnecting: false })

                }
            })
        }
        else {
            Swal.fire({
                title: t("errors.error"),
                text: message,
                icon: "error",
                confirmButtonColor: "#54c2f0",
                background: isDarkTheme() ? " #333" : "white"
            }
            ).then(() => {
                this.setState({ isConnecting: false })
            })
        }
        const swal2 = document.querySelectorAll("#swal2-title, #swal2-content")
        swal2.forEach(element => {
            element.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        })
    }
    handleLogin = () => {
        const { t } = this.props

        this.setState({ isConnecting: true })
        const { isEmailValid, email, password, isPasswordValid } = this.state
        if (!email || !password) {
            this.openErrorBox(t("errors.complete-all-fields"))
        }
        else if (!isEmailValid) {
            this.openErrorBox(t("errors.invalid-email"))
        }
        else if (!isPasswordValid) {
            this.openErrorBox(t("errors.wrong-password"))
        }
        else {
            window.ipc.send("login", { email: email, password: password })
        }
    }


    handleAuthToAnotherAccount = event => {
        event.preventDefault()
        saveEmail("")
        window.location.reload()
    }

    render() {
        const { password, email, emailFieldFocused, passwordFieldFocused, isConnecting, showPassword, isEmailValid, isPasswordValid, isEmailSaved } = this.state
        const { t } = this.props
        return (

            <div className="auth-login">
                <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo-login" id="nav-logo-login" width={120} height={110} />
                <div className="welcome-login">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/icon.png`} alt="welcome-icon" className="icon" width={100} height={120} />
                    <h1 className="welcome">{t("welcome-on")} OpenPasswordManager</h1>
                    {!isEmailSaved &&
                        <>
                            <h3>{t("auth.new-on-opm")}</h3>
                            <Link to="/auth/signup" className="signup-btn">{t("auth.signup")}</Link>
                        </>
                    }
                </div>

                <form className="login-form">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo-login-responsive" id="nav-logo-login-responsive" className="icon" width={120} height={110} />

                    <h2>{t("auth.login")}</h2>
                    {!isEmailSaved &&
                        <div className="field" style={{ border: !isEmailValid ? "1px #F42D0E solid" : emailFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                            <i className="fal fa-envelope field-icon"></i>
                            <input type="email" id="email-input" placeholder={t("auth.email")}
                                onBlur={() => this.setState({ emailFieldFocused: false })}
                                onFocus={() => this.setState({ emailFieldFocused: true })} value={email}
                                onChange={event => this.handleEmailChange(event)} />

                        </div>
                    }
                    {isEmailSaved &&

                        <p className="email-text"><strong>{email}</strong></p>

                    }

                    <div className="field" style={{ border: !isPasswordValid ? "1px #F42D0E solid" : passwordFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                        <i className="fal fa-key field-icon"></i>
                        <input type={showPassword ? "text" : "password"} id="password-input" placeholder={t("auth.password")}
                            onBlur={() => this.setState({ passwordFieldFocused: false })}
                            onFocus={() => this.setState({ passwordFieldFocused: true })} value={password}
                            onChange={event => this.handlePasswordChange(event)} autoCorrect="off" autoCapitalize="off" />

                        <i className={`fal ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg show-password-btn`} onClick={() => { this.setState({ showPassword: !showPassword }) }}></i>

                    </div>
                    {isEmailSaved &&

                        <p className="login-another-account" onClick={this.handleAuthToAnotherAccount}>{t("auth.login-another-account")}</p>
                    }
                    <button className="login-btn" onClick={this.handleLogin} disabled={isConnecting}
                        style={{ width: isConnecting ? "50px" : "" }}>{isConnecting ? <i className="fad fa-spinner-third fa-spin"></i> : t("auth.login")}
                    </button>

                    {!isEmailSaved &&
                        <Link to="/auth/signup" className="no-account">{t("auth.no-account")}</Link>

                    }
                </form>
            </div>)
    }
}

export default withTranslation()(Login)