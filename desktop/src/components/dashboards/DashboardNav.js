import { Component } from "react"
import "../css/dashboards/DashboardNav.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import { withRouter } from "react-router"
import React, { useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTranslation } from "react-i18next"
import { NavLink } from "react-router-dom"
import { isDarkTheme } from "../../utils/themes-utils"

class DashboardNav extends Component {

    state = {
        navOpened: true,
    }


    componentDidMount() {
        const dashboardNav = document.querySelector(".dashboard-nav")
        dashboardNav.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        dashboardNav.style.setProperty("--current-nav-theme", isDarkTheme() ? "#CECECE" : "#555555")
        dashboardNav.style.setProperty("--bg-nav-theme", isDarkTheme() ? "#333" : "rgba(198,237,240, 0.35)")
    }


    //Arrow fx for binding

    handleNavOpened = () => {
        const { navOpened } = this.state
        this.setState({ navOpened: !navOpened })


    }

    handleMyAccountClicked = () => {
        this.props.history.push("/dashboard/my-account/")
    }

    render() {
        const { navOpened } = this.state
        const { t } = this.props
        return (
            <>
                <div className={`dashboard-nav ${!navOpened ? "nav-closed" : ""}`} >
                    <div className="top-buttons" style={{ flexDirection: navOpened ? "row" : "column" }}>
                        <i className="fas fa-bars open-nav-button top-button" onClick={this.handleNavOpened} />
                        <i className="fas fa-user-circle open-account-settings top-button" title={t("account.my-account")} onClick={this.handleMyAccountClicked} />

                    </div>

                    <div className="nav-buttons"  >
                        <NavLink to="/dashboard/passwords" className="nav-button" activeClassName="current-link"><i className="far fa-lock-alt" />{navOpened ? t("my-passwords") : ""}</NavLink>
                        <NavLink to="/dashboard/generator" className="nav-button" activeClassName="current-link"><i className="far fa-bolt" />{navOpened ? t("generator.generator") : ""}</NavLink>
                        <NavLink to="/dashboard/settings" className="nav-button" activeClassName="current-link"><i className="far fa-cog" />{navOpened ? t("settings.settings") : ""}</NavLink>
                    </div>

                </div>
                <ResponsiveButton />

            </>
        )
    }

}

let setMenuOpen

const ResponsiveButton = () => {
    const [open, setOpen] = useState(false)
    setMenuOpen = setOpen
    return (
        <>
            <div className="responsive-btn" style={{ position: open ? "fixed" : "absolute" }} open={open} onClick={() => setOpen(!open)}>
                <div style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)' }} />
                <div style={{ transform: open ? 'translateX(100%)' : 'translateX(0)', opacity: open ? 0 : 1 }} />
                <div style={{ transform: open ? 'rotate(-45deg)' : 'rotate(0)' }} />
            </div>
            <ResponsiveNav open={open} />
        </>
    )
}
const ResponsiveNav = ({ open }) => {
    const isResponsive = useMediaQuery('(max-width: 1280px)')

    const { t } = useTranslation()
    return (
        <ul className="responsive-nav-ul" open={open} style={{ transform: open ? 'translateX(0)' : 'translateX(100%)', display: isResponsive ? "flex" : "none", backgroundColor: isDarkTheme() ? "#333" : "rgb(198,237,240)" }}>
            <NavLink to="/dashboard/passwords" onClick={() => setMenuOpen(false)} className="nav-button" activeClassName="current-link"><i className="far fa-lock-alt" />{t("my-passwords")}</NavLink>
            <NavLink to="/dashboard/generator" onClick={() => setMenuOpen(false)} className="nav-button" activeClassName="current-link"><i className="far fa-bolt" />{t("generator.generator")}</NavLink>
            <NavLink to="/dashboard/settings" onClick={() => setMenuOpen(false)} className="nav-button" activeClassName="current-link"><i className="far fa-cog" />{t("settings.settings")}</NavLink>
            <NavLink to="/dashboard/my-account" onClick={() => setMenuOpen(false)} className="nav-button" activeClassName="current-link"><i className="far fa-user" />{t("account.my-account")}</NavLink>

        </ul>
    )
}

export default withTranslation()(withRouter(DashboardNav))