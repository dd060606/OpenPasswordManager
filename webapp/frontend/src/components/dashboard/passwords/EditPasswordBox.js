
import "../css/passwords/EditPasswordBox.css"
import { withTranslation } from "react-i18next"
import "../../../i18n"
import { Component } from "react"
import { withRouter } from "react-router-dom"

class EditPasswordBox extends Component {


    state = {
        showPassword: false,
        password: "",
        url: "",
        websiteName: "",
        username: "",
        passwordFieldFocused: false,
        websiteFieldFocused: false,
        websiteNameFieldFocused: false,
        usernameFieldFocused: false,
        isLoading: false

    }
    constructor(props) {
        super(props)
        this.baseState = this.state
    }


    //Arrow fx for binding
    handleEditPasswordBoxClosed = event => {

        let editPasswordOverlay = document.querySelector(".edit-password-overlay")

        let editPasswordBox = document.querySelector(".edit-password-overlay")
        let closePasswordBoxButton = document.querySelector(".edit-password-box > .close")
        let cancelButton = document.querySelector(".edit-password-box .cancel-button")

        if (event.target === closePasswordBoxButton || event.target === cancelButton) {
            editPasswordOverlay.style.visibility = "hidden"
            editPasswordOverlay.style.opacity = 0
        }

        else if (event.target !== editPasswordBox) {
            return
        }
        editPasswordOverlay.style.visibility = "hidden"
        editPasswordOverlay.style.opacity = 0
        this.setState(this.baseState)
    }



    render() {
        const { showPassword, password, isLoading, url, websiteName, username, passwordFieldFocused, websiteFieldFocused, websiteNameFieldFocused, usernameFieldFocused } = this.state
        const { t } = this.props
        return (
            <div className="edit-password-overlay" onClick={event => this.handleEditPasswordBoxClosed(event)} >
                <div className="edit-password-box">
                    <button className="close">&times;</button>


                    <div className="content">
                        <div className="fields">
                            <p className="field-name">{t("passwords.website-name")}</p>
                            <div className="field" style={{ border: websiteNameFieldFocused ? "1px #54c2f0 solid" : "1px rgba(236, 236, 236, 0.8) solid" }}>
                                <input type="text" placeholder={t("passwords.website-name")}
                                    onBlur={() => this.setState({ websiteNameFieldFocused: false })}
                                    onFocus={() => this.setState({ websiteNameFieldFocused: true })} value={websiteName}
                                    onChange={event => this.setState({ websiteName: event.target.value })} autoCorrect="off" autoCapitalize="off" />


                            </div>
                        </div>
                        <div className="fields">
                            <p className="field-name">{t("passwords.website")}</p>
                            <div className="field" style={{ border: websiteFieldFocused ? "1px #54c2f0 solid" : "1px rgba(236, 236, 236, 0.8) solid" }}>
                                <input type="text" placeholder={t("passwords.add-url")}
                                    onBlur={() => this.setState({ websiteFieldFocused: false })}
                                    onFocus={() => this.setState({ websiteFieldFocused: true })} value={url}
                                    onChange={event => this.setState({ url: event.target.value })} autoCorrect="off" autoCapitalize="off" />


                            </div>
                        </div>
                        <div className="fields">
                            <p className="field-name">{t("passwords.username")}</p>
                            <div className="field" style={{ border: usernameFieldFocused ? "1px #54c2f0 solid" : "1px rgba(236, 236, 236, 0.8) solid" }}>
                                <input type="text" placeholder={t("passwords.username")}
                                    onBlur={() => this.setState({ usernameFieldFocused: false })}
                                    onFocus={() => this.setState({ usernameFieldFocused: true })} value={username}
                                    onChange={event => this.setState({ username: event.target.value })} autoCorrect="off" autoCapitalize="off" />


                            </div>
                        </div>
                        <div className="fields">
                            <p className="field-name">{t("auth.password")}</p>
                            <div className="field" style={{ border: passwordFieldFocused ? "1px #54c2f0 solid" : "1px rgba(236, 236, 236, 0.8) solid" }}>
                                <input type={showPassword ? "text" : "password"} placeholder={t("auth.password")}
                                    onBlur={() => this.setState({ passwordFieldFocused: false })}
                                    onFocus={() => this.setState({ passwordFieldFocused: true })} value={password}
                                    onChange={event => this.setState({ password: event.target.value })} autoCorrect="off" autoCapitalize="off" />

                                <i className={`fal ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg show-password-btn`} onClick={() => { this.setState({ showPassword: !showPassword }) }}></i>

                            </div>
                        </div>
                        <div className="buttons">
                            <button className="add-password-button" disabled={isLoading} >{isLoading ? <i className="fad fa-spinner-third fa-spin" /> : t("passwords.add")}</button>
                            <button className="cancel-button">{t("cancel")}</button>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(withRouter(EditPasswordBox))