import { Component } from "react"
import "./css/Login.css"
import { translate } from "../../utils/langManager"
import Swal from 'sweetalert2'


class Login extends Component {


    state = {
        email: "",
        password: "",
        emailFieldFocused: false,
        passwordFieldFocused: false,
        isConnecting: false,
        showPassword: false,
        isEmailValid: true
    }


    //Arrow fx for binding

    handleEmailChange = event => {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.setState({ email: event.target.value, isEmailValid: event.target.value === "" ? true : emailRegex.test(event.target.value) })

    }
    handlePasswordChange = event => {

        this.setState({ password: event.target.value })

    }
    handleEmailFocus = () => {
        this.setState({ emailFieldFocused: true })
    }
    handlePasswordFocus = () => {
        this.setState({ passwordFieldFocused: true })
    }
    handleEmailBlur = () => {
        this.setState({ emailFieldFocused: false })
    }
    handlePasswordBlur = () => {
        this.setState({ passwordFieldFocused: false })
    }
    handleLogin = () => {
        this.setState({ isConnecting: true })
        const { isEmailValid, email, password } = this.state
        if (email === "" || password === "") {
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
        if (!isEmailValid) {
            Swal.fire({
                title: translate("error"),
                text: translate("invalid-email"),
                type: "error",
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
        const { password, email, emailFieldFocused, passwordFieldFocused, isConnecting, showPassword, isEmailValid } = this.state
        return (

            <div className="auth-login">
                <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo" id="nav-logo" width={120} height={110} />
                <div className="welcome-login">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/icon.png`} alt="welcome-icon" className="icon" width={100} height={120} />
                    <h1 className="welcome">{translate("welcome-on")} OpenPasswordManager</h1>
                    <h3>{translate("new-on-opm")}</h3>
                    <button className="signup-btn">{translate("signup")}</button>
                </div>

                <form className="login-form">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo-responsive" id="nav-logo-responsive" className="icon" width={120} height={110} />

                    <h2>{translate("login")}</h2>
                    <div className="email-field" style={{ border: !isEmailValid ? "2px #F42D0E solid" : emailFieldFocused ? "2px #54c2f0 solid" : "none" }}>
                        <i className="fal fa-envelope field-icon"></i>
                        <input type="email" id="email-input" placeholder={translate("email")} onBlur={this.handleEmailBlur} onFocus={this.handleEmailFocus} value={email} onChange={event => this.handleEmailChange(event)} />

                    </div>
                    <div className="password-field" style={{ border: passwordFieldFocused ? "2px #54c2f0 solid" : "none" }}>
                        <i className="fal fa-key field-icon"></i>
                        <input type={showPassword ? "text" : "password"} id="password-input" placeholder={translate("password")} onBlur={this.handlePasswordBlur} onFocus={this.handlePasswordFocus} value={password} onChange={event => this.handlePasswordChange(event)} />
                        <i className={`fal ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg show-password-btn`} onClick={this.handleShowPassword}></i>

                    </div>
                    <a href="/" className="forgot-password">{translate("forgot-password")}</a>
                    <button className="login-btn" onClick={this.handleLogin} disabled={isConnecting} style={{ width: isConnecting ? "50px" : "" }}>{isConnecting ? <i className="fad fa-spinner-third fa-spin"></i> : translate("login")}</button>
                    <a href="/" className="already-account">{translate("already-have-account")}</a>


                </form>

            </div>)
    }
}

export default Login