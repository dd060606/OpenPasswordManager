import { Component } from "react"
import "../css/auth/Register.css"
import Swal from 'sweetalert2'
import { Link } from "react-router-dom"
import axios from "axios"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import i18n from 'i18next'
import { saveEmail, sendToAuthPage } from "../../utils/auth-utils"
import { isDarkTheme } from "../../utils/themes-utils"

const lettersRegex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/


class Register extends Component {


    state = {
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        confirmPassword: "",
        firstnameFieldFocused: false,
        lastnameFieldFocused: false,
        emailFieldFocused: false,
        passwordFieldFocused: false,
        confirmPasswordFieldFocused: false,
        isConnecting: false,
        showPassword: false,
        isEmailValid: true,
        isPasswordValid: true,
        isFirstnameValid: true,
        isLastnameValid: true,
        emailConfirmationEnabled: false
    }


    componentDidMount() {


        const authRegister = document.querySelector(".auth-register")
        authRegister.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        authRegister.style.setProperty("--bg-theme", isDarkTheme() ? "#212121" : "white")
        authRegister.style.setProperty("--bg-2-theme", isDarkTheme() ? "#333" : "white")
        authRegister.style.setProperty("--field-bg-theme", isDarkTheme() ? "#333" : "rgba(236, 236, 236, 0.8)")
        authRegister.style.setProperty("--blue-bg-theme", isDarkTheme() ? "#333" : "rgba(198,237,240,0.35)")

    }

    //Arrow fx for binding

    handleEmailChange = event => {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.setState({ email: event.target.value, isEmailValid: event.target.value === "" ? true : emailRegex.test(event.target.value) })
    }
    handlePasswordChange = event => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&_]{8,}$/

        this.setState({ password: event.target.value, isPasswordValid: event.target.value === "" ? true : passwordRegex.test(event.target.value) })
    }
    handleFirstnameChange = event => {
        this.setState({ firstname: event.target.value, isFirstnameValid: event.target.value === "" ? true : lettersRegex.test(event.target.value) })

    }
    handleLastnameChange = event => {
        this.setState({ lastname: event.target.value, isLastnameValid: event.target.value === "" ? true : lettersRegex.test(event.target.value) })

    }
    handleConfirmPasswordChange = event => {

        this.setState({ confirmPassword: event.target.value })
    }

    openErrorBox(message, isHTMLText = false) {
        const { t } = this.props
        if (isHTMLText) {
            Swal.fire({
                title: t("errors.error"),
                html: message,
                icon: "error",
                confirmButtonColor: "#54c2f0",
                background: isDarkTheme() ? " #333" : "white"
            }
            ).then(() => {
                this.setState({ isConnecting: false })
            })
        } else {
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
    handleRegister = () => {
        const { t } = this.props

        this.setState({ isConnecting: true })
        const { isFirstnameValid, isLastnameValid, isEmailValid, isPasswordValid, lastname, firstname, email, password, confirmPassword } = this.state
        if (!email || !password || !confirmPassword || !firstname || !lastname) {
            this.openErrorBox(t("errors.complete-all-fields"))

        }
        else if (!isEmailValid) {
            this.openErrorBox(t("errors.invalid-email"))
        }
        else if (!isPasswordValid) {
            this.openErrorBox(`<p>${t("errors.password-require")}<br/>${t("errors.available-password-chars")} @ $ ! % * _ ? &" </p>`, true)

        }
        else if (!isLastnameValid) {
            this.openErrorBox(t("errors.invalid-lastname"))
        }
        else if (!isFirstnameValid) {
            this.openErrorBox(t("errors.invalid-firstname"))
        }
        else if (password !== confirmPassword) {
            this.openErrorBox(t("errors.password-confirmation-not-match"))
        }
        else {
            axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/signup`,
                {
                    lastname: lastname,
                    firstname: firstname,
                    email: email,
                    password: password,
                    lang: i18n.language
                }
            ).then(res => {
                if (res.data.result === "success") {
                    this.setState({ emailConfirmationEnabled: true })
                    const interval = setInterval(() => {
                        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/email/validated`, { email: email })
                            .then(res => {
                                if (res.data.value === true) {
                                    clearInterval(interval)


                                    axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`,
                                        {
                                            email: email,
                                            password: password
                                        }
                                    ).then(res => {
                                        if (res.data.result === "success") {
                                            saveEmail(email)
                                            this.props.history.push({
                                                pathname: "/", state: {
                                                    token: res.data.token
                                                }
                                            })
                                        }
                                    })
                                        .catch(err => {
                                            sendToAuthPage()
                                        })

                                }
                            })
                    }, 5000);

                }

                this.setState({ isConnecting: false })

            }).catch(error => {
                if (error.response && error.response.data) {
                    if (error.response.data.result === "error") {
                        if (error.response.data.type === "internal-error") {
                            this.openErrorBox(t("errors.internal-error"))
                        }
                        else if (error.response.data.type === "email-already-exists") {
                            this.openErrorBox(t("errors.email-already-exists"))
                        }
                        else {
                            this.openErrorBox(t("errors.unknown-error"))
                        }
                    }
                }
                else {
                    this.openErrorBox(t("errors.unknown-error"))
                }
                this.setState({ isConnecting: false })
            })
        }
    }
    handleShowPassword = () => {
        const { showPassword } = this.state
        if (showPassword) {
            this.setState({ showPassword: false })
        }
        else {
            this.setState({ showPassword: true })
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
        const { password, email, lastname, firstname, confirmPassword,
            emailFieldFocused, passwordFieldFocused, confirmPasswordFieldFocused, firstnameFieldFocused, lastnameFieldFocused,
            isConnecting, showPassword, isEmailValid, isPasswordValid, isFirstnameValid, isLastnameValid, emailConfirmationEnabled } = this.state
        const { t } = this.props
        return (

            <div className="auth-register">
                <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo-register" id="nav-logo-register" width={120} height={110} />
                <div className="welcome-register">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/icon.png`} alt="welcome-icon" className="icon" width={100} height={120} />
                    <h1 className="welcome">{t("welcome-on")} OpenPasswordManager</h1>
                    <h3>{t("auth.already-registered")}</h3>
                    <Link to="/auth/login" className="login-btn">{t("auth.login")}</Link>

                </div>

                <form className="register-form" style={{ display: emailConfirmationEnabled ? "none" : "flex" }}>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo-reg-responsive" id="nav-logo-reg-responsive" className="icon" width={120} height={110} />

                    <h2>{t("auth.signup")}</h2>

                    <div className="name-fields">
                        <div className="name-field field" style={{ border: !isFirstnameValid ? "1px #F42D0E solid" : firstnameFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                            <i className="fal fa-id-card-alt field-icon"></i>
                            <input type="text" id="firstname-input" placeholder={t("auth.firstname")}
                                onBlur={() => this.setState({ firstnameFieldFocused: false })}
                                onFocus={() => this.setState({ firstnameFieldFocused: true })} value={firstname}
                                onChange={event => this.handleFirstnameChange(event)} autoCorrect="off" />

                        </div>
                        <div className="name-field field" style={{ border: !isLastnameValid ? "1px #F42D0E solid" : lastnameFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                            <i className="fal fa-id-card-alt field-icon"></i>
                            <input type="text" id="lastname-input" placeholder={t("auth.lastname")}
                                onBlur={() => this.setState({ lastnameFieldFocused: false })}
                                onFocus={() => this.setState({ lastnameFieldFocused: true })} value={lastname}
                                onChange={event => this.handleLastnameChange(event)} autoCorrect="off" />

                        </div>
                    </div>
                    <div className="field" style={{ border: !isEmailValid ? "1px #F42D0E solid" : emailFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                        <i className="fal fa-envelope field-icon"></i>
                        <input type="email" id="email-input" placeholder={t("auth.email")}
                            onBlur={() => this.setState({ emailFieldFocused: false })}
                            onFocus={() => this.setState({ emailFieldFocused: true })} value={email}
                            onChange={event => this.handleEmailChange(event)} />

                    </div>
                    <div className="field" style={{ border: !isPasswordValid ? "1px #F42D0E solid" : passwordFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                        <i className="fal fa-key field-icon"></i>
                        <input type={showPassword ? "text" : "password"} id="password-input" placeholder={t("auth.password")}
                            onBlur={() => this.setState({ passwordFieldFocused: false })}
                            onFocus={() => this.setState({ passwordFieldFocused: true })} value={password}
                            onChange={event => this.handlePasswordChange(event)} autoCorrect="off" autoCapitalize="off" />

                        <i className={`fal ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg show-password-btn`} onClick={this.handleShowPassword}></i>

                    </div>
                    <div className="field" style={{ border: confirmPasswordFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                        <i className="fal fa-key field-icon"></i>
                        <input type={showPassword ? "text" : "password"} id="confirm-password-input" placeholder={t("auth.confirm-password")}
                            onBlur={() => this.setState({ confirmPasswordFieldFocused: false })}
                            onFocus={() => this.setState({ confirmPasswordFieldFocused: true })} value={confirmPassword}
                            onChange={event => this.handleConfirmPasswordChange(event)} autoCorrect="off" autoCapitalize="off" />

                        <i className={`fal ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg show-password-btn`} onClick={this.handleShowPassword}></i>

                    </div>

                    <button className="register-btn" onClick={event => {
                        event.preventDefault()
                        this.handleRegister()
                    }} disabled={isConnecting}
                        style={{ width: isConnecting ? "50px" : "" }}>{isConnecting ? <i className="fad fa-spinner-third fa-spin"></i> : t("auth.signup")}
                    </button>

                    <Link to="/auth/login" className="already-account">{t("auth.already-have-account")}</Link>


                </form>
                {emailConfirmationEnabled &&
                    <form className="register-form">
                        <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo-reg-responsive" id="nav-logo-reg-responsive" className="icon" width={120} height={110} />
                        <h2>{t("auth.signup")}</h2>
                        <p className="email"><strong>{email}</strong></p>
                        <p className="confirmation-email-sent">
                            {t("auth.confirm-email-to-continue")}
                        </p>
                        <button className="resend-email" onClick={(event) => this.handleResendEmail(event)}>{t("auth.resend-email")}</button>
                    </form>
                }


            </div>)
    }
}

export default withTranslation()(Register)