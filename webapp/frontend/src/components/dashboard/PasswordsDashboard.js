import { Component } from "react"
import React from "react"
import "./css/PasswordsDashboard.css"
import DashboardNav from "./DashboardNav"
import Loading from "../Loading"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import PasswordItem from "./passwords/PasswordItem"
import { readToken, sendToAuthPage } from "../../utils/auth-utils"
import axios from "axios"
import Swal from "sweetalert2"
import AddPasswordBox from "./passwords/AddPasswordBox"
import EnterPasswordBox from "./passwords/EnterPasswordBox"
import EditPasswordBox from "./passwords/EditPasswordBox"


class PasswordsDashboard extends Component {

    state = {

        isLoading: true,
        token: "",
        credentials: [],
        search: "",
        password: "",
        enterPasswordType: "new",
        currentCredential: {},

    }

    componentDidMount() {
        const { isLoading } = this.state
        const { t } = this.props
        this.setState({ token: readToken(this.props) })
        if (isLoading) {

            axios.get(`${process.env.REACT_APP_SERVER_URL}/api/credentials/`, { headers: { "Authorization": `Bearer ${readToken(this.props)}` } })
                .then(result => {
                    let finalCredentials = []
                    for (let i = 0; i < result.data.credentials.length; i++) {
                        result.data.credentials[i].smallImageURL = `https://d2erpoudwvue5y.cloudfront.net/_46x30/${this.extractRootDomain(result.data.credentials[i].url).replaceAll(".", "_")}@2x.png`
                        result.data.credentials[i].largeImageURL = `https://d2erpoudwvue5y.cloudfront.net/_160x106/${this.extractRootDomain(result.data.credentials[i].url).replaceAll(".", "_")}@2x.png`

                        finalCredentials.push(result.data.credentials[i])
                    }
                    this.setState({ isLoading: false, credentials: result.data.credentials })
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
                })
        }
    }
    extractHostname(url) {
        var hostname;

        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        hostname = hostname.split(':')[0];
        hostname = hostname.split('?')[0];

        return hostname;
    }

    extractRootDomain(url) {
        var domain = this.extractHostname(url),
            splitArr = domain.split('.'),
            arrLen = splitArr.length;
        if (arrLen > 2) {
            domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
            if (splitArr[arrLen - 2].length === 2 && splitArr[arrLen - 1].length === 2) {
                domain = splitArr[arrLen - 3] + '.' + domain;
            }
        }
        return domain;
    }

    //Arrow fx for binding
    handleAddPassword = () => {
        const { password } = this.state
        if (password) {
            let addPasswordOverlay = document.querySelector(".add-password-overlay")
            addPasswordOverlay.style.visibility = "visible"
            addPasswordOverlay.style.opacity = 1
        }
        else {
            let enterPasswordOverlay = document.querySelector(".enter-password-overlay")
            enterPasswordOverlay.style.visibility = "visible"
            enterPasswordOverlay.style.opacity = 1
            this.setState({ enterPasswordType: "new" })
        }

    }

    handleEditPassword = credential => {
        const { password } = this.state
        this.setState({ currentCredential: credential })
        if (password) {
            let editPasswordOverlay = document.querySelector(".edit-password-overlay")
            editPasswordOverlay.style.visibility = "visible"
            editPasswordOverlay.style.opacity = 1


        }
        else {
            let enterPasswordOverlay = document.querySelector(".enter-password-overlay")
            enterPasswordOverlay.style.visibility = "visible"
            enterPasswordOverlay.style.opacity = 1
            this.setState({ enterPasswordType: "edit" })
        }

    }







    render() {
        const { isLoading, credentials, search, token, password, enterPasswordType, currentCredential } = this.state
        const { t } = this.props
        return (
            <>
                {isLoading && <Loading />}
                {
                    !isLoading &&
                    <div className="my-passwords">
                        <DashboardNav token={token} />

                        <div className="passwords-content">
                            <nav>
                                <button id="add-password-button" onClick={this.handleAddPassword}><i className="fas fa-plus" /> {t("passwords.add")}</button>
                                <div className="search-bar">
                                    <i className="fas fa-search" />
                                    <input type="text" placeholder={t("search")} value={search} onChange={event => this.setState({ search: event.target.value })} />
                                </div>
                            </nav>

                            <div className="password-list" style={{ justifyContent: credentials.length === 0 ? "center" : "" }}>
                                {credentials.length === 0 &&
                                    <div className="no-passwords">
                                        <i className="fal fa-lock-alt" />
                                        <h3>{t("passwords.no-passwords")}</h3>
                                    </div>
                                }
                                {credentials.length !== 0 &&


                                    credentials.map((credential, index) => {
                                        if (credential.url.toLowerCase().includes(search.toLowerCase()) || credential.name.toLowerCase().includes(search.toLowerCase()) || credential.username.toLowerCase().includes(search.toLowerCase())) {
                                            return <PasswordItem credential={credential} index={index} key={index} onClick={currentCredential => this.handleEditPassword(currentCredential)} />

                                        }
                                        return <></>

                                    })
                                }
                                <EnterPasswordBox token={token} type={enterPasswordType} setPassword={password => this.setState({ password: password })} />
                                <AddPasswordBox token={token} password={password} />
                                <EditPasswordBox token={token} password={password} credential={currentCredential} />
                            </div>
                        </div>

                    </div>
                }
            </>

        )
    }
}

export default withTranslation()(PasswordsDashboard)
