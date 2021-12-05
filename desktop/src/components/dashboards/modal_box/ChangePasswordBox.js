
import "../../css/dashboards/modal_box/ChangePasswordBox.css"
import { withTranslation } from "react-i18next"
import "../../../i18n"
import { Component } from "react"
import { isDarkTheme } from "../../../utils/themes-utils"
import Swal from "sweetalert2"
import { withRouter } from "react-router"

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&_]{8,}$/

class ChangePasswordBox extends Component {


    state = {
        showPassword: false,
        showNewPw: false,
        showConfirmNewPw: false,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        currentPwFieldFocused: false,
        newPwFieldFocused: false,
        confirmNewPwFieldFocused: false,
        isPasswordValid: true,
        isNewPasswordValid: true,
        isConfirmNewPwValid: true,
        isLoading: false

    }
    constructor(props) {
        super(props)
        this.baseState = this.state

    }
    componentDidMount() {
        const changePassword = document.querySelector(".change-password-box")
        changePassword.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        changePassword.style.setProperty("--bg-theme", isDarkTheme() ? "#333" : "white")
        changePassword.style.setProperty("--field-bg-theme", isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)")

        window.ipc.receive("changePasswordResult", res => {
            const { t } = this.props

            if (res.result === "success") {
                Swal.fire({
                    title: t("success"),
                    text: t("account.password-modified"),
                    icon: "success",
                    confirmButtonColor: "#54c2f0",
                    background: isDarkTheme() ? " #333" : "white"
                }
                ).then(() => {
                    this.setState({ isLoading: false })
                    this.closeBox()
                })
                const swal2 = document.querySelectorAll("#swal2-title, #swal2-content")
                swal2.forEach(element => {
                    element.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
                })
            }
            else {
                let errorMessage = t("errors.unknown-error")
                if (res.error) {
                    if (res.error.type === "internal-error") {
                        errorMessage = t("errors.internal-error")
                    } else if (res.error.type === "invalid-token") {
                        this.props.history.push("/auth/login")
                        return
                    }
                    else if (res.error.type === "wrong-password") {
                        errorMessage = t("errors.wrong-password")
                    }
                }
                this.openErrorBox(errorMessage)
            }
        })
    }



    closeBox() {
        const changePasswordOverlay = document.querySelector(".change-password-overlay")
        changePasswordOverlay.style.visibility = "hidden"
        changePasswordOverlay.style.opacity = 0
        setTimeout(() => this.setState(this.baseState), 100)
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
                this.setState({ isLoading: false })
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
                this.setState({ isLoading: false })
            })
        }

        const swal2 = document.querySelectorAll("#swal2-title, #swal2-content")
        swal2.forEach(element => {
            element.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        })
    }

    //Arrow fx for binding
    handleAddPasswordBoxClosed = event => {
        const changePasswordBox = document.querySelector(".change-password-overlay")
        const closePasswordBoxButton = document.querySelector(".change-password-box > .close")
        const cancelButton = document.querySelector(".change-password-box .cancel-button")
        if (event.target === closePasswordBoxButton || event.target === cancelButton) {
            this.closeBox()
        }
        else if (event.target !== changePasswordBox) {
            return
        }
        this.closeBox()
    }



    handleChangePassword = () => {
        const { newPassword, currentPassword, confirmNewPassword } = this.state
        const { t } = this.props
        this.setState({ isLoading: true })

        if (!newPassword || !currentPassword || !confirmNewPassword) {
            this.openErrorBox(t("errors.complete-all-fields"))
        }
        else if (!passwordRegex.test(newPassword) || !passwordRegex.test(currentPassword) || !passwordRegex.test(confirmNewPassword)) {
            this.openErrorBox(`<p>${t("errors.password-require")}<br/>${t("errors.available-password-chars")} @ $ ! % * _ ? &" </p>`, true)
        }
        else if (newPassword !== confirmNewPassword) {
            this.openErrorBox(t("errors.new-password-confirmation-not-match"))
        }
        else {
            window.ipc.send("changePassword", { currentPassword: currentPassword, newPassword: newPassword })
        }


    }
    handleCurrentPasswordChange = event => {
        this.setState({ currentPassword: event.target.value, isPasswordValid: event.target.value === "" ? true : passwordRegex.test(event.target.value) })
    }
    handleNewPasswordChange = event => {
        this.setState({ newPassword: event.target.value, isNewPasswordValid: event.target.value === "" ? true : passwordRegex.test(event.target.value) })
    }
    handleConfirmNewPwChange = event => {
        const { newPassword } = this.state
        this.setState({ confirmNewPassword: event.target.value, isConfirmNewPwValid: event.target.value === "" ? true : event.target.value === newPassword })
    }


    render() {
        const { showPassword, showNewPw, showConfirmNewPw, currentPassword, newPassword, confirmNewPassword, isLoading, currentPwFieldFocused, newPwFieldFocused, confirmNewPwFieldFocused, isPasswordValid, isNewPasswordValid, isConfirmNewPwValid } = this.state
        const { t } = this.props
        return (
            <div className="change-password-overlay" onClick={event => this.handleAddPasswordBoxClosed(event)} >
                <div className="change-password-box">
                    <button className="close">&times;</button>

                    <h2>{t("account.change-password")}</h2>

                    <div className="content">
                        <div className="fields">
                            <p><strong>{t("account.current-password")} : </strong></p>
                            <div className="field" style={{ border: !isPasswordValid ? "1px #F42D0E solid" : currentPwFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                                <input type={showPassword ? "text" : "password"} placeholder={t("account.current-password")}
                                    onBlur={() => this.setState({ currentPwFieldFocused: false })}
                                    onFocus={() => this.setState({ currentPwFieldFocused: true })} value={currentPassword}
                                    onChange={event => this.handleCurrentPasswordChange(event)} autoCorrect="off" autoCapitalize="off" />

                                <i className={`fal ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg show-password-btn`} onClick={() => { this.setState({ showPassword: !showPassword }) }}></i>

                            </div>
                            <p><strong>{t("account.new-password")} : </strong></p>
                            <div className="field" style={{ border: !isNewPasswordValid ? "1px #F42D0E solid" : newPwFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                                <input type={showNewPw ? "text" : "password"} placeholder={t("account.new-password")}
                                    onBlur={() => this.setState({ newPwFieldFocused: false })}
                                    onFocus={() => this.setState({ newPwFieldFocused: true })} value={newPassword}
                                    onChange={event => this.handleNewPasswordChange(event)} autoCorrect="off" autoCapitalize="off" />

                                <i className={`fal ${showNewPw ? "fa-eye" : "fa-eye-slash"} fa-lg show-password-btn`} onClick={() => { this.setState({ showNewPw: !showNewPw }) }}></i>

                            </div>
                            <p><strong>{t("account.confirm-new-password")} : </strong></p>
                            <div className="field" style={{ border: !isConfirmNewPwValid ? "1px #F42D0E solid" : confirmNewPwFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                                <input type={showConfirmNewPw ? "text" : "password"} placeholder={t("account.confirm-new-password")}
                                    onBlur={() => this.setState({ confirmNewPwFieldFocused: false })}
                                    onFocus={() => this.setState({ confirmNewPwFieldFocused: true })} value={confirmNewPassword}
                                    onChange={event => this.handleConfirmNewPwChange(event)} autoCorrect="off" autoCapitalize="off" />

                                <i className={`fal ${showConfirmNewPw ? "fa-eye" : "fa-eye-slash"} fa-lg show-password-btn`} onClick={() => { this.setState({ showConfirmNewPw: !showConfirmNewPw }) }}></i>

                            </div>
                        </div>
                        <div className="buttons">
                            <button className="continue-button" disabled={isLoading} onClick={this.handleChangePassword}>{isLoading ? <i className="fad fa-spinner-third fa-spin" /> : t("confirm")}</button>
                            <button className="cancel-button">{t("cancel")}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(withRouter(ChangePasswordBox))