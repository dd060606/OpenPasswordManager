
import "../../css/dashboards/modal_box/ConfirmPasswordBox.css"
import { withTranslation } from "react-i18next"
import "../../../i18n"
import { Component } from "react"
import Swal from "sweetalert2"
import { withRouter } from "react-router-dom"
import { isDarkTheme } from "../../../utils/themes-utils"


class EnterPasswordBox extends Component {


    state = {
        showPassword: false,
        password: "",
        passwordFieldFocused: false,
        isLoading: false

    }
    constructor(props) {
        super(props)
        this.baseState = this.state
    }
    componentDidMount() {
        const confirmPassword = document.querySelector(".confirm-password-box")
        confirmPassword.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        confirmPassword.style.setProperty("--bg-theme", isDarkTheme() ? "#333" : "white")
        confirmPassword.style.setProperty("--field-bg-theme", isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)")

        window.ipc.receive("confirmPasswordResult", res => {
            const { t } = this.props

            if (res.result === "success") {
                this.setState({ isLoading: false })
                this.closeBox()
                if (this.props.type === "new") {
                    const addPasswordOverlay = document.querySelector(".add-password-overlay")
                    addPasswordOverlay.style.visibility = "visible"
                    addPasswordOverlay.style.opacity = 1
                }
                else if (this.props.type === "edit") {
                    const editPasswordOverlay = document.querySelector(".edit-password-overlay")
                    editPasswordOverlay.style.visibility = "visible"
                    editPasswordOverlay.style.opacity = 1
                }
            }
            else {
                let errorMessage = t("errors.unknown-error")
                if (res.error) {
                    if (res.error.type === "internal-error") {
                        errorMessage = t("errors.internal-error")
                    } else if (res.error.type === "invalid-credentials") {
                        errorMessage = t("errors.invalid-credentials")
                    }
                }
                this.openErrorBox(errorMessage)
            }
        })
    }
    openErrorBox(message) {
        const { t } = this.props
        Swal.fire({
            title: t("errors.error"),
            text: message,
            icon: "error",
            confirmButtonColor: "#54c2f0",
            background: isDarkTheme() ? " #333" : "white"
        }
        ).then(() => {
            this.setState({ isLoading: false })
        })
        const swal2 = document.querySelectorAll("#swal2-title, #swal2-content")
        swal2.forEach(element => {
            element.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        })
    }
    closeBox() {
        const confirmPasswordOverlay = document.querySelector(".confirm-password-overlay")
        confirmPasswordOverlay.style.visibility = "hidden"
        confirmPasswordOverlay.style.opacity = 0
        setTimeout(() => this.setState(this.baseState), 100)
    }
    //Arrow fx for binding
    handleAddPasswordBoxClosed = event => {


        const confirmPasswordBox = document.querySelector(".confirm-password-overlay")
        const closePasswordBoxButton = document.querySelector(".confirm-password-box > .close")
        const cancelButton = document.querySelector(".confirm-password-box .cancel-button")

        if (event.target === closePasswordBoxButton || event.target === cancelButton) {
            this.closeBox()
        }

        else if (event.target !== confirmPasswordBox) {
            return
        }
        this.closeBox()


    }



    handleLogin = () => {
        const { isLoading, password } = this.state
        const { t } = this.props
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&]{8,}$/
        if (!isLoading) {
            this.setState({ isLoading: true })

            if (!password) {
                this.openErrorBox(t("errors.complete-all-fields"))
                return
            }
            if (!passwordRegex.test(password)) {
                this.openErrorBox(t("errors.wrong-password"))
                return
            }

            window.ipc.send("confirmPassword", password)

        }
    }



    render() {
        const { showPassword, password, isLoading, passwordFieldFocused } = this.state
        const { t } = this.props
        return (
            <div className="confirm-password-overlay" onClick={event => this.handleAddPasswordBoxClosed(event)} >
                <div className="confirm-password-box">
                    <button className="close">&times;</button>

                    <h2>{t("passwords.confirm-password")}</h2>

                    <div className="content">
                        <div className="fields">
                            <div className="field" style={{ border: passwordFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                                <input type={showPassword ? "text" : "password"} placeholder={t("auth.password")}
                                    onBlur={() => this.setState({ passwordFieldFocused: false })}
                                    onFocus={() => this.setState({ passwordFieldFocused: true })} value={password}
                                    onChange={event => this.setState({ password: event.target.value })} autoCorrect="off" autoCapitalize="off" />

                                <i className={`fal ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg show-password-btn`} onClick={() => { this.setState({ showPassword: !showPassword }) }}></i>

                            </div>
                        </div>
                        <div className="buttons">
                            <button className="continue-button" disabled={isLoading} onClick={this.handleLogin}>{isLoading ? <i className="fad fa-spinner-third fa-spin" /> : t("continue")}</button>
                            <button className="cancel-button">{t("cancel")}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(withRouter(EnterPasswordBox))