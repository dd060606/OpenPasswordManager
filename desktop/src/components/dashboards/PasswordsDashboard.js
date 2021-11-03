import { Component } from "react"
import React from "react"
import "../css/dashboards/PasswordsDashboard.css"
import DashboardNav from "./DashboardNav"
import Loading from "../Loading"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import PasswordItem from "./PasswordItem"
import Swal from "sweetalert2"
import AddPasswordBox from "./modal_box/AddPasswordBox"
import EnterPasswordBox from "./modal_box/ConfirmPasswordBox"
import { InputLabel, MenuItem, Select, withStyles } from "@material-ui/core"
import EditPasswordBox from "./modal_box/EditPasswordBox"
import { getSavedTheme, isDarkTheme } from "../../utils/themes-utils"


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
        credentials: [],
        search: "",
        enterPasswordType: "new",
        currentCredential: {},
        currentTheme: getSavedTheme(),
        sortValue: 2,
        offlineModeEnabled: false

    }


    componentDidMount() {
        const { isLoading } = this.state
        if (isLoading) {
            this.updateCredentials()
        }
        window.ipc.receive("loadCredentialsResult", res => {
            const { t } = this.props
            if (res.result === "success") {
                this.setState({
                    isLoading: false, credentials: res.credentials, offlineModeEnabled: window.ipc.sendSync("isOfflineMode")
                })
                setTimeout(() => {
                    const myPasswords = document.querySelector(".my-passwords")
                    myPasswords.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
                    myPasswords.style.setProperty("--bg-theme", isDarkTheme() ? "#212121" : "white")
                    myPasswords.style.setProperty("--line-theme", isDarkTheme() ? "white" : "rgba(0,0,0,0.1)")
                }, 50)

            }
            else {
                let errorMessage = t("errors.unknown-error")

                if (res.error) {
                    if (res.error === "offline-file-error") {
                        errorMessage = t("errors.credentials-file-error")
                    }
                    else if (res.error.type === "internal-error") {
                        errorMessage = t("errors.internal-error")
                    } else if (res.error.type === "invalid-token") {
                        this.props.history.push("/auth/login")
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
            }
        })

    }

    updateCredentials() {

        const availablesSortValues = [0, 1, 2]
        const credentialsSort = window.ipc.sendSync("getCredentialsSort")
        if (!isNaN(credentialsSort) && availablesSortValues.includes(parseInt(credentialsSort))) {
            this.setState({ sortValue: parseInt(credentialsSort) })
        }
        else {
            window.ipc.send("setCredentialsSort", 2)
        }
        window.ipc.send("loadCredentials")
    }




    //Arrow fx for binding
    handleAddPassword = () => {
        if (window.ipc.sendSync("isPasswordSaved")) {
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
        this.setState({ currentCredential: credential })
        if (window.ipc.sendSync("isPasswordSaved")) {
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
        window.ipc.send("setCredentialsSort", parseInt(event.target.value))
        this.setState({ isLoading: true })
        this.updateCredentials()

    }

    render() {
        const { isLoading, credentials, search, enterPasswordType, currentCredential, sortValue, offlineModeEnabled } = this.state
        const { t, classes } = this.props

        return (
            <>
                {isLoading && <Loading />}
                {
                    !isLoading &&
                    <div className="my-passwords" >
                        <DashboardNav />

                        <div className="passwords-content">
                            {offlineModeEnabled &&
                                <span style={{ marginTop: 5 }}>{t("offline-mode-enabled")}</span>
                            }
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
                                <EnterPasswordBox type={enterPasswordType} />
                                <AddPasswordBox reloadCredentials={credentials => this.setState({ credentials: credentials })} />
                                <EditPasswordBox credential={currentCredential} />
                            </div>


                        </div>
                    </div>
                }
            </>

        )
    }
}

export default withTranslation()(withStyles(styles)(PasswordsDashboard))
