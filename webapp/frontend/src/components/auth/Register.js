import { Component } from "react"
import "./css/Register.css"
import Swal from 'sweetalert2'
import { Link } from "react-router-dom"
import axios from "axios"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import i18n from 'i18next'



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

    //Arrow fx for binding

    handleEmailChange = event => {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.setState({ email: event.target.value, isEmailValid: event.target.value === "" ? true : emailRegex.test(event.target.value) })
    }
    handlePasswordChange = event => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*_?&]{8,}$/

        this.setState({ password: event.target.value, isPasswordValid: event.target.value === "" ? true : passwordRegex.test(event.target.value) })
    }
    handleFirstnameChange = event => {
        const lettersRegex = /^[A-Za-z]+$/
        this.setState({ firstname: event.target.value, isFirstnameValid: event.target.value === "" ? true : lettersRegex.test(event.target.value) })

    }
    handleLastnameChange = event => {
        const lettersRegex = /^[A-Za-z]+$/
        this.setState({ lastname: event.target.value, isLastnameValid: event.target.value === "" ? true : lettersRegex.test(event.target.value) })

    }
    handleConfirmPasswordChange = event => {

        this.setState({ confirmPassword: event.target.value })
    }


    handleRegister = () => {
        const { t } = this.props

        this.setState({ isConnecting: true })
        const { isFirstnameValid, isLastnameValid, isEmailValid, isPasswordValid, lastname, firstname, email, password, confirmPassword } = this.state
        if (email === "" || password === "" || confirmPassword === "" || firstname === "" || lastname === "") {
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
                // eslint-disable-next-line
                html: '<p>' + t("errors.password-require") + "<br/>" + t("errors.available-password-chars") + "@ $ ! % * _ ? &" + '</p>',
                icon: "error",
                confirmButtonColor: "#54c2f0"
            }
            ).then(() => {
                this.setState({ isConnecting: false })
                return
            })
        }
        else if (!isLastnameValid) {
            Swal.fire({
                title: t("errors.error"),
                text: t("errors.invalid-lastname"),
                icon: "error",
                confirmButtonColor: "#54c2f0"
            }
            ).then(() => {
                this.setState({ isConnecting: false })
                return
            })
        }
        else if (!isFirstnameValid) {
            Swal.fire({
                title: t("errors.error"),
                text: t("errors.invalid-firstname"),
                icon: "error",
                confirmButtonColor: "#54c2f0"
            }
            ).then(() => {
                this.setState({ isConnecting: false })
                return
            })
        }
        else if (password !== confirmPassword) {
            Swal.fire({
                title: t("errors.error"),
                text: t("errors.password-confirmation-not-match"),
                icon: "error",
                confirmButtonColor: "#54c2f0"
            }
            ).then(() => {
                this.setState({ isConnecting: false })
                return
            })
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
                    let interval = setInterval(() => {
                        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/email/validated`, { email: email })
                            .then(res => {
                                if (res.data.value === true) {
                                    clearInterval(interval)
                                    this.props.history.push("/")
                                }
                            })
                    }, 5000);

                }

                this.setState({ isConnecting: false })

            }).catch(error => {
                if (error.data) {
                    if (error.response.data.result === "error") {
                        if (error.response.data.type === "internal-error") {
                            Swal.fire({
                                title: t("errors.error"),
                                text: t("errors.internal-error"),
                                icon: "error",
                                confirmButtonColor: "#54c2f0"
                            }
                            )
                        }
                        else if (error.response.data.type === "email-already-exists") {
                            Swal.fire({
                                title: t("errors.error"),
                                text: t("errors.email-already-exists"),
                                icon: "error",
                                confirmButtonColor: "#54c2f0"
                            }
                            )
                        }
                    }
                }
                else {
                    Swal.fire({
                        title: t("errors.error"),
                        text: t("errors.unknown-error"),
                        icon: "error",
                        confirmButtonColor: "#54c2f0"
                    }
                    )
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
        const { lastname, firstname, email, password } = this.state
        event.target.disabled = true
        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/email/resend`,
            {
                lastname: lastname,
                firstname: firstname,
                email: email,
                password: password,
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
                        <div className="name-field field" style={{ border: !isFirstnameValid ? "1px #F42D0E solid" : firstnameFieldFocused ? "1px #54c2f0 solid" : "1px rgba(236, 236, 236, 0.8) solid" }}>
                            <i className="fal fa-id-card-alt field-icon"></i>
                            <input type="text" id="firstname-input" placeholder={t("auth.firstname")}
                                onBlur={() => this.setState({ firstnameFieldFocused: false })}
                                onFocus={() => this.setState({ firstnameFieldFocused: true })} value={firstname}
                                onChange={event => this.handleFirstnameChange(event)} />

                        </div>
                        <div className="name-field field" style={{ border: !isLastnameValid ? "1px #F42D0E solid" : lastnameFieldFocused ? "1px #54c2f0 solid" : "1px rgba(236, 236, 236, 0.8) solid" }}>
                            <i className="fal fa-id-card-alt field-icon"></i>
                            <input type="text" id="lastname-input" placeholder={t("auth.lastname")}
                                onBlur={() => this.setState({ lastnameFieldFocused: false })}
                                onFocus={() => this.setState({ lastnameFieldFocused: true })} value={lastname}
                                onChange={event => this.handleLastnameChange(event)} />

                        </div>
                    </div>
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
                    <div className="field" style={{ border: confirmPasswordFieldFocused ? "1px #54c2f0 solid" : "1px rgba(236, 236, 236, 0.8) solid" }}>
                        <i className="fal fa-key field-icon"></i>
                        <input type={showPassword ? "text" : "password"} id="confirm-password-input" placeholder={t("auth.confirm-password")}
                            onBlur={() => this.setState({ confirmPasswordFieldFocused: false })}
                            onFocus={() => this.setState({ confirmPasswordFieldFocused: true })} value={confirmPassword}
                            onChange={event => this.handleConfirmPasswordChange(event)} />

                        <i className={`fal ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg show-password-btn`} onClick={this.handleShowPassword}></i>

                    </div>

                    <button className="register-btn" onClick={this.handleRegister} disabled={isConnecting}
                        style={{ width: isConnecting ? "50px" : "" }}>{isConnecting ? <i className="fad fa-spinner-third fa-spin"></i> : t("auth.signup")}
                    </button>

                    <Link to="/auth/login" className="already-account">{t("auth.already-have-account")}</Link>


                </form>
                {emailConfirmationEnabled &&
                    <form className="register-form">
                        <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo-reg-responsive" id="nav-logo-reg-responsive" className="icon" width={120} height={110} />
                        <h2>{t("auth.signup")}</h2>
                        <strong>{email}</strong>
                        <p className="confirmation-email-sent">
                            {t("auth.please-confirm-your-email")}
                        </p>
                        <button className="resend-email" onClick={(event) => this.handleResendEmail(event)}>{t("auth.resend-email")}</button>
                    </form>
                }


            </div>)
    }
}

export default withTranslation()(Register)