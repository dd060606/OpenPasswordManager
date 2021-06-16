
import "../css/passwords/EditPasswordBox.css"
import { withTranslation } from "react-i18next"
import "../../../i18n"
import { Component } from "react"
import { withRouter } from "react-router-dom"
import CryptoJS from "crypto-js"
import Swal from "sweetalert2"
import axios from "axios"
import { sendToAuthPage } from "../../../utils/auth-utils"


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

    componentDidMount() {
        let editPasswordOverlay = document.querySelector(".edit-password-overlay")
        let overlayStyleObserver = new MutationObserver(mutations => {
            mutations.forEach(mutationRecord => {
                if (mutationRecord.target === editPasswordOverlay) {
                    if (editPasswordOverlay.style.visibility === "visible") {
                        this.setState({ websiteName: this.props.credential.name, url: this.props.credential.url, username: this.props.credential.username, password: CryptoJS.AES.decrypt(this.props.credential.password, this.props.password).toString(CryptoJS.enc.Utf8) })
                    }
                }
            });
        })
        overlayStyleObserver.observe(editPasswordOverlay, { attributes: true, attributeFilter: ['style'] });

    }
    //Arrow fx for binding
    handleEditPasswordBoxClosed = event => {


        let editPasswordBox = document.querySelector(".edit-password-overlay")
        let closePasswordBoxButton = document.querySelector(".edit-password-box > .close")
        let cancelButton = document.querySelector(".edit-password-box .cancel-button")

        if (event.target === closePasswordBoxButton || event.target === cancelButton) {
            this.closeBox()

        }

        else if (event.target !== editPasswordBox) {
            return
        }
        this.closeBox()

    }

    closeBox() {
        let editPasswordOverlay = document.querySelector(".edit-password-overlay")
        editPasswordOverlay.style.visibility = "hidden"
        editPasswordOverlay.style.opacity = 0
        setTimeout(() => this.setState(this.baseState), 100)
    }

    handleSave = () => {
        const { websiteName, password, username, url } = this.state
        const { t } = this.props

        if (!websiteName) {
            return Swal.fire({
                title: t("errors.error"),
                text: t("errors.enter-website-name"),
                icon: "error",
                confirmButtonColor: "#54c2f0"
            })
        }
        this.setState({ isLoading: true })
        let encryptedPassword = CryptoJS.AES.encrypt(password, this.props.password).toString()
        axios.put(`${process.env.REACT_APP_SERVER_URL}/api/credentials/edit/${this.props.credential.id}`, {
            username: username,
            password: encryptedPassword,
            name: websiteName,
            url: url.startsWith("http://") || url.startsWith("https://") ? url : `http://${url}`
        }, { headers: { "Authorization": `Bearer ${this.props.token}` } })
            .then(result => {
                this.setState({ isLoading: false })
                this.closeBox()
                this.props.reloadCredentials()

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
                    } else if (err.response.data.type === "invalid-token") {
                        sendToAuthPage(this.props)
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
    }
    handleDelete = () => {
        const { t } = this.props
        Swal.fire({
            title: t("passwords.delete-password"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#54c2f0",
            cancelButtonColor: '#d33',
            confirmButtonText: t("confirm"),
            cancelButtonText: t("cancel")
        }).then((result) => {
            if (result.isConfirmed) {
                this.setState({ isLoading: true })
                axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/credentials/delete/${this.props.credential.id}`, { headers: { "Authorization": `Bearer ${this.props.token}` } })
                    .then(result => {
                        this.setState({ isLoading: false })
                        this.closeBox()
                        this.props.reloadCredentials()

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
                            } else if (err.response.data.type === "invalid-token") {
                                sendToAuthPage(this.props)
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
            }
        })

    }

    render() {
        const { showPassword, password, isLoading, url, websiteName, username, passwordFieldFocused, websiteFieldFocused, websiteNameFieldFocused, usernameFieldFocused } = this.state
        const { t } = this.props
        return (
            <div className="edit-password-overlay" onClick={event => this.handleEditPasswordBoxClosed(event)} >
                <div className="edit-password-box">
                    <button className="close">&times;</button>


                    <div className="content">
                        <img src={this.props.credential.largeImageURL} alt="" className="website-icon" />

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
                            <button className="save-password-button" disabled={isLoading} onClick={this.handleSave} >{isLoading ? <i className="fad fa-spinner-third fa-spin" /> : t("save")}</button>
                            <div>
                                <button className="cancel-button">{t("cancel")}</button>
                                <button className="delete-button" onClick={this.handleDelete}><i className="far fa-trash-alt" /></button>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(withRouter(EditPasswordBox))