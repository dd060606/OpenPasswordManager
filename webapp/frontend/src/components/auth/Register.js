import { Component } from "react"
import "./css/Register.css"
import { translate } from "../../utils/langManager"
import Swal from 'sweetalert2'


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
        isPasswordValid: true
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

    handleConfirmPasswordChange = event => {

        this.setState({ confirmPassword: event.target.value })
    }


    handleRegister = () => {
        this.setState({ isConnecting: true })
        const { isEmailValid, isPasswordValid, email, password, confirmPassword } = this.state
        if (email === "" || password === "" || confirmPassword === "") {
            Swal.fire({
                title: translate("error"),
                text: translate("complete-all-fields"),
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
                title: translate("error"),
                text: translate("invalid-email"),
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
                title: translate("error"),
                // eslint-disable-next-line
                html: '<p>' + translate("password-require") + "<br/>" + translate("available-password-chars") + "@ $ ! % * _ ? &" + '</p>',
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
                title: translate("error"),
                text: translate("password-confirmation-not-match"),
                icon: "error",
                confirmButtonColor: "#54c2f0"
            }
            ).then(() => {
                this.setState({ isConnecting: false })
                return
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
        const { password, email, lastname, firstname, confirmPassword,
            emailFieldFocused, passwordFieldFocused, confirmPasswordFieldFocused, firstnameFieldFocused, lastnameFieldFocused,
            isConnecting, showPassword, isEmailValid, isPasswordValid } = this.state
        return (

            <div className="auth-register">
                <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo-register" id="nav-logo-register" width={120} height={110} />
                <div className="welcome-register">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/icon.png`} alt="welcome-icon" className="icon" width={100} height={120} />
                    <h1 className="welcome">{translate("welcome-on")} OpenPasswordManager</h1>
                    <h3>{translate("already-registered")}</h3>
                    <button className="login-btn">{translate("login")}</button>
                </div>

                <form className="register-form">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo-reg-responsive" id="nav-logo-reg-responsive" className="icon" width={120} height={110} />

                    <h2>{translate("signup")}</h2>

                    <div className="name-fields">
                        <div className="name-field field" style={{ border: firstnameFieldFocused ? "1px #54c2f0 solid" : "none" }}>
                            <i className="fal fa-envelope field-icon"></i>
                            <input type="text" id="firstname-input" placeholder={translate("firstname")}
                                onBlur={() => this.setState({ firstnameFieldFocused: false })}
                                onFocus={() => this.setState({ firstnameFieldFocused: true })} value={firstname}
                                onChange={event => this.setState({ firstname: event.target.value })} />

                        </div>
                        <div className="name-field field" style={{ border: lastnameFieldFocused ? "1px #54c2f0 solid" : "none" }}>
                            <i className="fal fa-envelope field-icon"></i>
                            <input type="text" id="lastname-input" placeholder={translate("lastname")}
                                onBlur={() => this.setState({ lastnameFieldFocused: false })}
                                onFocus={() => this.setState({ lastnameFieldFocused: true })} value={lastname}
                                onChange={event => this.setState({ lastname: event.target.value })} />

                        </div>
                    </div>


                    <div className="field" style={{ border: !isEmailValid ? "1px #F42D0E solid" : emailFieldFocused ? "1px #54c2f0 solid" : "none" }}>
                        <i className="fal fa-envelope field-icon"></i>
                        <input type="email" id="email-input" placeholder={translate("email")}
                            onBlur={() => this.setState({ emailFieldFocused: false })}
                            onFocus={() => this.setState({ emailFieldFocused: true })} value={email}
                            onChange={event => this.handleEmailChange(event)} />

                    </div>
                    <div className="field" style={{ border: !isPasswordValid ? "1px #F42D0E solid" : passwordFieldFocused ? "1px #54c2f0 solid" : "none" }}>
                        <i className="fal fa-key field-icon"></i>
                        <input type={showPassword ? "text" : "password"} id="password-input" placeholder={translate("password")}
                            onBlur={() => this.setState({ passwordFieldFocused: false })}
                            onFocus={() => this.setState({ passwordFieldFocused: true })} value={password}
                            onChange={event => this.handlePasswordChange(event)} />

                        <i className={`fal ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg show-password-btn`} onClick={this.handleShowPassword}></i>

                    </div>
                    <div className="field" style={{ border: confirmPasswordFieldFocused ? "1px #54c2f0 solid" : "none" }}>
                        <i className="fal fa-key field-icon"></i>
                        <input type={showPassword ? "text" : "password"} id="confirm-password-input" placeholder={translate("confirm-password")}
                            onBlur={() => this.setState({ confirmPasswordFieldFocused: false })}
                            onFocus={() => this.setState({ confirmPasswordFieldFocused: true })} value={confirmPassword}
                            onChange={event => this.handleConfirmPasswordChange(event)} />

                        <i className={`fal ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg show-password-btn`} onClick={this.handleShowPassword}></i>

                    </div>

                    <button className="register-btn" onClick={this.handleRegister} disabled={isConnecting}
                        style={{ width: isConnecting ? "50px" : "" }}>{isConnecting ? <i className="fad fa-spinner-third fa-spin"></i> : translate("signup")}
                    </button>

                    <a href="/" className="already-account">{translate("already-have-account")}</a>


                </form>

            </div>)
    }
}

export default Register