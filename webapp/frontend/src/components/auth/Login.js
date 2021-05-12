import { Component } from "react"
import "./css/Login.css"
import Swal from 'sweetalert2'
import { Link } from "react-router-dom"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import axios from "axios"
import { cookies } from "../../index"


class Login extends Component {


    state = {
        email: "",
        password: "",
        emailFieldFocused: false,
        passwordFieldFocused: false,
        isConnecting: false,
        showPassword: false,
        isEmailValid: true,
        isPasswordValid: true
    }

    //Arrow fx for binding

    handleEmailChange = event => {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        this.setState({ email: event.target.value, isEmailValid: event.target.value === "" ? true : emailRegex.test(event.target.value) })
    }
    handlePasswordChange = event => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*_?&]{8,}$/
        this.setState({ password: event.target.value, isPasswordValid: event.target.value === "" ? true : passwordRegex.test(event.target.value) })
    }

    handleLogin = () => {
        const { t } = this.props

        this.setState({ isConnecting: true })
        const { isEmailValid, email, password, isPasswordValid } = this.state
        if (email === "" || password === "") {
            Swal.fire({
                title: t("errors.error"),
                text: t("errors.complete-all-fields"),
                icon: "error",
                confirmButtonColor: "#54c2f0"
            }
            ).then(() => {
                this.setState({ isConnecting: false })
                return
            })

        }
        else if (!isEmailValid) {
            Swal.fire({
                title: t("errors.error"),
                text: t("errors.invalid-email"),
                icon: "error",
                confirmButtonColor: "#54c2f0"
            }
            ).then(() => {
                this.setState({ isConnecting: false })
                return
            })

        }
        else if (!isPasswordValid) {
            Swal.fire({
                title: t("errors.error"),
                text: t("errors.wrong-password"),
                icon: "error",
                confirmButtonColor: "#54c2f0"
            }
            ).then(() => {
                this.setState({ isConnecting: false })
                return
            })
        }
        else {

            axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`,
                {
                    email: email,
                    password: password
                }
            ).then(res => {
                if (res.data.result === "success") {
                    cookies.set("token", res.data.token, { path: "/", maxAge: 60 * 60 * 3 })
                    this.props.history.push({
                        pathname: "/", state: {
                            token: res.data.token
                        }
                    })
                }
            })
                .catch(err => {
                    if (err.response && err.response.data) {
                        if (err.response.data.type === "internal-error") {
                            Swal.fire({
                                title: t("errors.error"),
                                text: t("errors.internal-error"),
                                icon: "error",
                                confirmButtonColor: "#54c2f0"
                            })
                        } else if (err.response.data.type === "invalid-credentials") {
                            Swal.fire({
                                title: t("errors.error"),
                                text: t("errors.invalid-credentials"),
                                icon: "error",
                                confirmButtonColor: "#54c2f0"
                            })
                        }
                        else if (err.response.data.type === "email-not-verified") {
                            this.props.history.push({
                                pathname: '/auth/email/confirmation',
                                state: { redirectedAfterLogin: true, email: email }
                            })
                        }
                        else {
                            Swal.fire({
                                title: t("errors.error"),
                                text: t("errors.unknown-error"),
                                icon: "error",
                                confirmButtonColor: "#54c2f0"
                            })
                        }
                    }
                    else {
                        Swal.fire({
                            title: t("errors.error"),
                            text: t("errors.unknown-error"),
                            icon: "error",
                            confirmButtonColor: "#54c2f0"
                        })
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





    render() {
        const { password, email, emailFieldFocused, passwordFieldFocused, isConnecting, showPassword, isEmailValid, isPasswordValid } = this.state
        const { t } = this.props
        return (

            <div className="auth-login">
                <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo-login" id="nav-logo-login" width={120} height={110} />
                <div className="welcome-login">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/icon.png`} alt="welcome-icon" className="icon" width={100} height={120} />
                    <h1 className="welcome">{t("welcome-on")} OpenPasswordManager</h1>
                    <h3>{t("auth.new-on-opm")}</h3>
                    <Link to="/auth/signup" className="signup-btn">{t("auth.signup")}</Link>
                </div>

                <form className="login-form">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo-login-responsive" id="nav-logo-login-responsive" className="icon" width={120} height={110} />

                    <h2>{t("auth.login")}</h2>
                    <div className="field" style={{ border: !isEmailValid ? "1px #F42D0E solid" : emailFieldFocused ? "1px #54c2f0 solid" : "1px rgba(236, 236, 236, 0.8) solid" }}>
                        <i className="fal fa-envelope field-icon"></i>
                        <input type="email" id="email-input" placeholder={t("auth.email")}
                            onBlur={() => this.setState({ emailFieldFocused: false })}
                            onFocus={() => this.setState({ emailFieldFocused: true })} value={email}
                            onChange={event => this.handleEmailChange(event)} />

                    </div>
                    <div className="field" style={{ border: !isPasswordValid ? "1px #F42D0E solid" : passwordFieldFocused ? "1px #54c2f0 solid" : "1px rgba(236, 236, 236, 0.8) solid" }}>
                        <i className="fal fa-key field-icon"></i>
                        <input type={showPassword ? "text" : "password"} id="password-input" placeholder={t("auth.password")}
                            onBlur={() => this.setState({ passwordFieldFocused: false })}
                            onFocus={() => this.setState({ passwordFieldFocused: true })} value={password}
                            onChange={event => this.handlePasswordChange(event)} />

                        <i className={`fal ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg show-password-btn`} onClick={this.handleShowPassword}></i>

                    </div>
                    <a href="/" className="forgot-password">{t("auth.forgot-password")}</a>

                    <button className="login-btn" onClick={this.handleLogin} disabled={isConnecting}
                        style={{ width: isConnecting ? "50px" : "" }}>{isConnecting ? <i className="fad fa-spinner-third fa-spin"></i> : t("auth.login")}
                    </button>

                    <Link to="/auth/signup" className="no-account">{t("auth.no-account")}</Link>
                </form>
            </div>)
    }
}

export default withTranslation()(Login)