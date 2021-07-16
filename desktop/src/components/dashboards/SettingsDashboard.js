import { Component } from "react"
import DashboardNav from "./DashboardNav"
import "../css/dashboards/SettingsDashboard.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import { getSavedTheme, isDarkTheme, isSavedThemeValid, saveTheme } from "../../utils/themes-utils"



class SettingsDashboard extends Component {

    state = {
        isLoading: false,
        currentTheme: "light"
    }
    componentDidMount() {
        const { currentTheme } = this.state

        if (isSavedThemeValid()) {
            this.setState({ currentTheme: getSavedTheme() })
        }
        else {
            saveTheme(currentTheme)
        }


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

    render() {
        const { t } = this.props
        const { isLoading, currentTheme } = this.state
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

                            </section>
                            <span className="line" />

                        </div>

                    </div>

                }
            </>

        )
    }
}

export default withTranslation()(SettingsDashboard)