import { Component } from "react"
import React from "react"
import "../css/dashboards/PasswordsDashboard.css"
import DashboardNav from "./DashboardNav"
import Loading from "../Loading"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import PasswordItem from "./PasswordItem"
import { readToken, sendToAuthPage } from "../../utils/auth-utils"
import axios from "axios"
import Swal from "sweetalert2"
import AddPasswordBox from "./modal_box/AddPasswordBox"
import EnterPasswordBox from "./modal_box/ConfirmPasswordBox"
import { InputLabel, MenuItem, Select, withStyles } from "@material-ui/core"
import EditPasswordBox from "./modal_box/EditPasswordBox"
import { getSavedTheme, isDarkTheme } from "../../utils/themes-utils"
import { cookies } from "../.."
import { sortCredentials, extractRootDomain } from "../../utils/credentials-utils"

const styles = theme => ({
    select: {
        '&:before': {
            borderColor: "#121212",
        },
        '&:after': {
            borderColor: "#121212",
        }
    },
    selectWhite: {
        '&:before': {
            borderColor: "white",
        },
        '&:after': {
            borderColor: "white",
        }
    },
    icon: {
        fill: "black",
    },
    iconWhite: {
        fill: "white",

    }
})

class PasswordsDashboard extends Component {

    state = {

        isLoading: true,
        token: "",
        credentials: [],
        search: "",
        password: "",
        enterPasswordType: "new",
        currentCredential: {},
        currentTheme: getSavedTheme(),
        sortValue: 2

    }


    componentDidMount() {
        const { isLoading } = this.state
        this.setState({ token: readToken(this.props) })



        if (isLoading) {
            this.updateCredentials()
        }

    }

    updateCredentials() {
        const { t } = this.props

        const availablesSortValues = [0, 1, 2]
        if (cookies.get("credentialsSort") && availablesSortValues.includes(parseInt(cookies.get("credentialsSort")))) {
            this.setState({ sortValue: parseInt(cookies.get("credentialsSort")) })
        }
        else {
            cookies.set("credentialsSort", 2)
        }

        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/credentials/`, { headers: { "Authorization": `Bearer ${readToken(this.props)}` } })
            .then(result => {
                let finalCredentials = []
                for (let i = 0; i < result.data.credentials.length; i++) {
                    result.data.credentials[i].smallImageURL = `https://d2erpoudwvue5y.cloudfront.net/_46x30/${extractRootDomain(result.data.credentials[i].url).replaceAll(".", "_")}@2x.png`
                    result.data.credentials[i].largeImageURL = `https://d2erpoudwvue5y.cloudfront.net/_160x106/${extractRootDomain(result.data.credentials[i].url).replaceAll(".", "_")}@2x.png`

                    finalCredentials.push(result.data.credentials[i])
                }

                this.setState({
                    isLoading: false, credentials: sortCredentials(result.data.credentials, this.state.sortValue)
                })
                const myPasswords = document.querySelector(".my-passwords")
                myPasswords.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
                myPasswords.style.setProperty("--bg-theme", isDarkTheme() ? "#212121" : "white")
                myPasswords.style.setProperty("--line-theme", isDarkTheme() ? "white" : "rgba(0,0,0,0.1)")
            })
            .catch(err => {
                let errorMessage = t("errors.unknown-error")
                if (err.response && err.response.data) {

                    if (err.response.data.type === "internal-error") {
                        errorMessage = t("errors.internal-error")
                    } else if (err.response.data.type === "invalid-token") {
                        sendToAuthPage(this.props)
                        return
                    }
                }
                Swal.fire({
                    title: t("errors.error"),
                    text: errorMessage,
                    icon: "error",
                    confirmButtonColor: "#54c2f0",
                    background: isDarkTheme() ? " #333" : "white",
                })
                this.setState({ isLoading: false })

                const swal2 = document.querySelectorAll("#swal2-title, #swal2-content")
                swal2.forEach(element => {
                    element.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
                })
                const myPasswords = document.querySelector(".my-passwords")
                myPasswords.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
                myPasswords.style.setProperty("--bg-theme", isDarkTheme() ? "#212121" : "white")
                myPasswords.style.setProperty("--line-theme", isDarkTheme() ? "white" : "rgba(0,0,0,0.1)")
                console.log(err)

            })
    }



    //Arrow fx for binding
    handleAddPassword = () => {
        const { password } = this.state
        if (password) {
            const addPasswordOverlay = document.querySelector(".add-password-overlay")
            addPasswordOverlay.style.visibility = "visible"
            addPasswordOverlay.style.opacity = 1
        }
        else {
            const confirmPasswordOverlay = document.querySelector(".confirm-password-overlay")
            confirmPasswordOverlay.style.visibility = "visible"
            confirmPasswordOverlay.style.opacity = 1
            this.setState({ enterPasswordType: "new" })
        }

    }

    handleEditPassword = credential => {
        const { password } = this.state
        this.setState({ currentCredential: credential })
        if (password) {
            const editPasswordOverlay = document.querySelector(".edit-password-overlay")
            editPasswordOverlay.style.visibility = "visible"
            editPasswordOverlay.style.opacity = 1
        }
        else {
            const confirmPasswordOverlay = document.querySelector(".confirm-password-overlay")
            confirmPasswordOverlay.style.visibility = "visible"
            confirmPasswordOverlay.style.opacity = 1
            this.setState({ enterPasswordType: "edit" })
        }


    }

    handleSortChange = event => {
        cookies.set("credentialsSort", parseInt(event.target.value))
        this.setState({ isLoading: true })
        this.updateCredentials()
    }

    render() {
        const { isLoading, credentials, search, token, password, enterPasswordType, currentCredential, sortValue } = this.state
        const { t, classes } = this.props

        return (
            <>
                {isLoading && <Loading />}
                {
                    !isLoading &&
                    <div className="my-passwords" >
                        <DashboardNav token={token} />

                        <div className="passwords-content">
                            <nav>
                                <button id="add-password-button" onClick={this.handleAddPassword}><i className="fas fa-plus" /> {t("passwords.add")}</button>
                                <div className="search-bar">
                                    <i className="fas fa-search" />
                                    <input type="text" placeholder={t("search")} style={{ color: isDarkTheme() ? "white" : "#121212" }} value={search} onChange={event => this.setState({ search: event.target.value })} />
                                </div>
                            </nav>
                            <div className="sort">
                                <InputLabel id="sort-select-label">{t("passwords.sort-by")}</InputLabel>
                                <Select
                                    labelId="sort-select-label"
                                    id="sort-select"
                                    value={sortValue}
                                    onChange={event => this.handleSortChange(event)}
                                    className={isDarkTheme() ? classes.selectWhite : classes.select}
                                    inputProps={{
                                        classes: {
                                            icon: isDarkTheme() ? classes.iconWhite : classes.icon,
                                        },
                                    }}
                                >
                                    <MenuItem value={0}>A-Z</MenuItem>
                                    <MenuItem value={1}>Z-A</MenuItem>
                                    <MenuItem value={2}>{t("passwords.creation-date")}</MenuItem>
                                </Select>
                            </div>

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
                                <AddPasswordBox token={token} password={password} reloadCredentials={credentials => this.setState({ credentials: sortCredentials(credentials, sortValue) })} />
                                <EditPasswordBox token={token} password={password} credential={currentCredential} reloadCredentials={credentials => this.setState({ credentials: sortCredentials(credentials, sortValue) })} />
                            </div>
                        </div>

                    </div>
                }
            </>

        )
    }
}
export default withTranslation()(withStyles(styles)(PasswordsDashboard))
