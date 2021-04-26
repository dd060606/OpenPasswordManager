import { Component } from "react"
import "./css/Login.css"
import { translate } from "../../utils/langManager"


class Login extends Component {

    render() {

        return (

            <div className="auth-login">

                <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo" id="nav-logo" width={120} height={110} />

                <div className="welcome-login">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/icon.png`} alt="welcome-icon" className="icon" width={100} height={120} />

                    <h1 className="welcome">{translate("welcome-on")} OpenPasswordManager</h1>
                    <h3>{translate("please-connect-to-opm")}</h3>
                </div>
                <form className="login-form">

                    <h2>{translate("login-to-opm")}</h2>
                    <div className="email-field">
                        <i className="fal fa-envelope field-icon"></i>
                        <input type="email" placeholder={translate("email")} />

                    </div>

                </form>
            </div>)
    }
}

export default Login