
import "../css/passwords/EnterPasswordBox.css"
import { withTranslation } from "react-i18next"
import "../../../i18n"
import { Component } from "react"
import Swal from "sweetalert2"
import axios from "axios"
import { readToken, sendToAuthPage } from "../../../utils/auth-utils"
import { withRouter } from "react-router-dom"


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


    //Arrow fx for binding
    handleAddPasswordBoxClosed = event => {

        let enterPasswordOverlay = document.querySelector(".enter-password-overlay")

        let enterPasswordBox = document.querySelector(".enter-password-overlay")
        let closePasswordBoxButton = document.querySelector(".enter-password-box > .close")
        let cancelButton = document.querySelector(".enter-password-box .cancel-button")

        if (event.target === closePasswordBoxButton || event.target === cancelButton) {
            enterPasswordOverlay.style.visibility = "hidden"
            enterPasswordOverlay.style.opacity = 0
        }

        else if (event.target !== enterPasswordBox) {
            return
        }
        enterPasswordOverlay.style.visibility = "hidden"
        enterPasswordOverlay.style.opacity = 0
        this.setState(this.baseState)
    }

    handleLogin = () => {
        const { isLoading, password } = this.state
        const { t } = this.props
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&]{8,}$/
        if (!isLoading) {
            this.setState({ isLoading: true })
            if (!password) {
                return Swal.fire({
                    title: t("errors.error"),
                    text: t("errors.complete-all-fields"),
                    icon: "error",
                    confirmButtonColor: "#54c2f0"
                }
                ).then(() => {
                    this.setState({ isLoading: false })
                })
            }
            if (!passwordRegex.test(password)) {
                return Swal.fire({
                    title: t("errors.error"),
                    text: t("errors.wrong-password"),
                    icon: "error",
                    confirmButtonColor: "#54c2f0"
                }
                ).then(() => {
                    this.setState({ isLoading: false })

                })
            }
            const token = readToken(this.props)
            if (token) {
                axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/info`, { headers: { "Authorization": `Bearer ${token}` } })
                    .then(result => {
                        let email = result.data.email
                        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`,
                            {
                                email: email,
                                password: password
                            }
                        ).then(res => {
                            if (res.data.result === "success") {
                                this.setState({ isLoading: false })
                                let enterPasswordOverlay = document.querySelector(".enter-password-overlay")
                                enterPasswordOverlay.style.visibility = "hidden"
                                enterPasswordOverlay.style.opacity = 0
                                if (this.props.type === "new-password") {
                                    let addPasswordOverlay = document.querySelector(".add-password-overlay")
                                    addPasswordOverlay.style.visibility = "visible"
                                    addPasswordOverlay.style.opacity = 1
                                    this.props.setPassword(password)
                                }
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

                                this.setState({ isLoading: false })

                            })


                    })
                    .catch(err => {
                        sendToAuthPage(this.props)
                    })
            }
            else {
                sendToAuthPage(this.props)
            }

        }
    }



    render() {
        const { showPassword, password, isLoading, passwordFieldFocused } = this.state
        const { t } = this.props
        return (
            <div className="enter-password-overlay" onClick={event => this.handleAddPasswordBoxClosed(event)} >
                <div className="enter-password-box">
                    <button className="close">&times;</button>

                    <h2>{t("passwords.enter-account-password")}</h2>

                    <div className="content">
                        <div className="fields">
                            <div className="field" style={{ border: passwordFieldFocused ? "1px #54c2f0 solid" : "1px rgba(236, 236, 236, 0.8) solid" }}>
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