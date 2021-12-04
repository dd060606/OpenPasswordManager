import { Component } from "react"
import DashboardNav from "./DashboardNav"
import "../css/dashboards/SettingsDashboard.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"

import { getSavedTheme, isDarkTheme, isSavedThemeValid, saveTheme } from "../../utils/themes-utils"
import { Switch, Radio, FormControlLabel, RadioGroup, withStyles } from "@material-ui/core"

const SettingsSwitch = withStyles({
    switchBase: {
        color: "#54c2f0",
        '&$checked': {
            color: "#54c2f0",
        },
        '&$checked + $track': {
            backgroundColor: "#54c2f0",
        },
    },
    checked: {},
    track: {}
})(Switch)

class SettingsDashboard extends Component {

    state = {
        isLoading: false,
        currentTheme: "light",
        launchAtStartup: true,
        minimizeOnClose: true,
        version: "",
        isDev: false
    }
    componentDidMount() {
        const { currentTheme } = this.state

        if (isSavedThemeValid()) {
            this.setState({ currentTheme: getSavedTheme() })
        }
        else {
            saveTheme(currentTheme)
        }

        this.setState({
            launchAtStartup: window.ipc.sendSync("isLaunchAtStartup"),
            minimizeOnClose: window.ipc.sendSync("isMinimizeOnClose"),
            version: window.ipc.sendSync("getVersion"),
            isDev: window.ipc.sendSync("isDev")
        })


        this.handleThemeChange(getSavedTheme())

    }

    //Arrow fx for binding
    handleThemeChange = value => {
        this.setState({ currentTheme: value })
        saveTheme(value)
        const darkTheme = isDarkTheme()
        const settings = document.querySelector(".settings")
        settings.style.setProperty("--text-theme", darkTheme ? "white" : "#121212")
        settings.style.setProperty("--bg-theme", darkTheme ? "#212121" : "white")
        settings.style.setProperty("--line-theme", darkTheme ? "white" : "rgba(0,0,0,0.1)")
        const dashboardNav = document.querySelector(".dashboard-nav")
        dashboardNav.style.setProperty("--text-theme", darkTheme ? "white" : "#121212")
        dashboardNav.style.setProperty("--current-nav-theme", darkTheme ? "#CECECE" : "#555555")
        dashboardNav.style.setProperty("--bg-nav-theme", darkTheme ? "#333" : "rgba(198,237,240, 0.35)")

    }

    handleLaunchAtStartupChange = () => {
        const { launchAtStartup } = this.state
        window.ipc.send("setLaunchAtStartup", !launchAtStartup)
        this.setState({ launchAtStartup: !launchAtStartup })
    }
    handleMinimizeOnCloseChange = () => {
        const { minimizeOnClose } = this.state
        window.ipc.send("setMinimizeOnClose", !minimizeOnClose)
        this.setState({ minimizeOnClose: !minimizeOnClose })
    }

    render() {
        const { t } = this.props
        const { isLoading, currentTheme, launchAtStartup, minimizeOnClose, version, isDev } = this.state
        return (


            <>
                {isLoading && <isLoading />}
                {
                    !isLoading &&
                    <div className="settings" >
                        <DashboardNav />

                        <div className="settings-content">
                            <h1>{t("settings.settings")}</h1>
                            <span className="line" />

                            <section>
                                <h3>{t("settings.general")}</h3>
                                <div className="appearance">
                                    <p><strong>{t("settings.appearance.appearance")} : </strong></p>

                                    <RadioGroup className="appearance-select" aria-label="appearance-select" name="appearance-select" value={currentTheme} onChange={event => this.handleThemeChange(event.target.value)} >
                                        <FormControlLabel value="light" control={<Radio className="radio-button" />} label={t("settings.appearance.light")} />
                                        <FormControlLabel value="dark" control={<Radio className="radio-button" />} label={t("settings.appearance.dark")} />
                                    </RadioGroup>
                                </div>
                                <div className="startup">
                                    <p><strong>{t("settings.startup.startup")} : </strong></p>
                                    <FormControlLabel
                                        className="switch-label"
                                        control={<SettingsSwitch className="settings-switch" checked={launchAtStartup} onChange={this.handleLaunchAtStartupChange} />}
                                        label={t("settings.startup.launch-at-startup")}
                                    />

                                </div>
                                <div className="close">
                                    <p><strong>{t("settings.close.close")} : </strong></p>

                                    <FormControlLabel
                                        className="switch-label"
                                        control={<SettingsSwitch className="settings-switch" checked={minimizeOnClose} onChange={this.handleMinimizeOnCloseChange} />}
                                        label={t("settings.close.minimize-on-close")}
                                    />
                                </div>

                            </section>

                            <span className="line" />
                            <p>v{version}{isDev ? "-DEV" : ""}</p>

                        </div>

                    </div>

                }
            </>

        )
    }
}

export default withTranslation()(SettingsDashboard)