import { Component } from "react"
import "./css/Login.css"
import { translate } from "../../utils/langManager"


class Login extends Component {


    state = {
        email: "",
        password: "",
        emailFieldFocused: false,
        passwordFieldFocused: false,
        isConnecting: false,
        showPassword: false
    }


    //Arrow fx for binding

    handleEmailChange = event => {

        this.setState({ email: event.target.value })

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
    }


    render() {
        const { password, email, emailFieldFocused, passwordFieldFocused, isConnecting, showPassword } = this.state
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
                    <div className="email-field" style={{ border: emailFieldFocused ? "2px #54c2f0 solid" : "none" }}>
                        <i className="fal fa-envelope field-icon"></i>
                        <input type="email" id="email-input" placeholder={translate("email")} onBlur={this.handleEmailBlur} onFocus={this.handleEmailFocus} value={email} onChange={event => this.handleEmailChange(event)} />

                    </div>
                    <div className="password-field" style={{ border: passwordFieldFocused ? "2px #54c2f0 solid" : "none" }}>
                        <i className="fal fa-key field-icon"></i>
                        <input type="password" id="password-input" placeholder={translate("password")} onBlur={this.handlePasswordBlur} onFocus={this.handlePasswordFocus} value={password} onChange={event => this.handlePasswordChange(event)} />
                        <i className={`fal ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg`}></i>

                    </div>
                    <a href="/" className="forgot-password">{translate("forgot-password")}</a>
                    <button className="login-btn" onClick={this.handleLogin} disabled={isConnecting} style={{ width: isConnecting ? "50px" : "" }}>{isConnecting ? <i className="fad fa-spinner-third fa-spin"></i> : translate("login")}</button>
                    <a href="/" className="already-account">{translate("already-have-account")}</a>


                </form>

            </div>)
    }
}

export default Login