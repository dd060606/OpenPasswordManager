import { Component } from "react"
import "./css/DashboardNav.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import { withRouter } from "react-router"
import React, { useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTranslation } from "react-i18next"


import { NavLink } from "react-router-dom"
import { readToken } from "../../utils/auth-utils"

class DashboardNav extends Component {

    state = {
        navOpened: true,
        token: ""
    }


    componentDidMount() {
        this.setState({ token: readToken(this.props) })
    }


    //Arrow fx for binding

    handleNavOpened = () => {
        const { navOpened } = this.state
        this.setState({ navOpened: !navOpened })


    }

    handleMyAccountClicked = () => {
        const { token } = this.state
        this.props.history.push({
            pathname: "/dashboard/my-account/", state: {
                token: token
            }
        })
    }

    render() {
        const { navOpened, token } = this.state
        const { t } = this.props
        return (
            <>
                <div className={`dashboard-nav ${!navOpened ? "nav-closed" : ""}`}>
                    <div className="top-buttons" style={{ flexDirection: navOpened ? "row" : "column" }}>
                        <i className="fas fa-bars open-nav-button top-button" onClick={this.handleNavOpened} />
                        <i className="fas fa-user-circle open-account-settings top-button" title={t("account.my-account")} onClick={this.handleMyAccountClicked} />

                    </div>

                    <div className="nav-buttons" >
                        <NavLink to={{
                            pathname: "/dashboard/passwords", state: {
                                token: token
                            }
                        }} className="nav-button" activeClassName="current-link"><i className="far fa-lock-alt" />{navOpened ? t("my-passwords") : ""}</NavLink>
                        <NavLink to={{
                            pathname: "/dashboard/generator", state: {
                                token: token
                            }
                        }} className="nav-button" activeClassName="current-link"><i className="far fa-bolt" />{navOpened ? t("generator.generator") : ""}</NavLink>
                        <NavLink to={{
                            pathname: "/dashboard/settings", state: {
                                token: token
                            }
                        }} className="nav-button" activeClassName="current-link"><i className="far fa-cog" />{navOpened ? t("settings") : ""}</NavLink>
                    </div>

                </div>
                <ResponsiveButton token={token} />

            </>
        )
    }

}

let setMenuOpen;

const ResponsiveButton = ({ token }) => {
    const [open, setOpen] = useState(false)
    setMenuOpen = setOpen
    return (
        <>
            <div className="responsive-btn" style={{ position: open ? "fixed" : "absolute" }} open={open} onClick={() => setOpen(!open)}>
                <div style={{ backgroundColor: "#1E1E1E", transform: open ? 'rotate(45deg)' : 'rotate(0)' }} />
                <div style={{ backgroundColor: "#1E1E1E", transform: open ? 'translateX(100%)' : 'translateX(0)', opacity: open ? 0 : 1 }} />
                <div style={{ backgroundColor: "#1E1E1E", transform: open ? 'rotate(-45deg)' : 'rotate(0)' }} />
            </div>
            <ResponsiveNav open={open} token={token} />
        </>
    )
}
const ResponsiveNav = ({ open, token }) => {
    const isResponsive = useMediaQuery('(max-width: 1280px)');

    const { t } = useTranslation()
    return (
        <ul className="responsive-nav-ul" open={open} style={{ transform: open ? 'translateX(0)' : 'translateX(100%)', display: isResponsive ? "flex" : "none" }}>
            <NavLink to={{
                pathname: "/dashboard/passwords", state: {
                    token: token
                }
            }} onClick={() => setMenuOpen(false)} className="nav-button" activeClassName="current-link"><i className="far fa-lock-alt" />{t("my-passwords")}</NavLink>
            <NavLink to={{
                pathname: "/dashboard/generator", state: {
                    token: token
                }
            }} onClick={() => setMenuOpen(false)} className="nav-button" activeClassName="current-link"><i className="far fa-bolt" />{t("generator.generator")}</NavLink>
            <NavLink to={{
                pathname: "/dashboard/settings", state: {
                    token: token
                }
            }} onClick={() => setMenuOpen(false)} className="nav-button" activeClassName="current-link"><i className="far fa-cog" />{t("settings")}</NavLink>
            <NavLink to={{
                pathname: "/dashboard/my-account", state: {
                    token: token
                }
            }} onClick={() => setMenuOpen(false)} className="nav-button" activeClassName="current-link"><i className="far fa-user" />{t("account.my-account")}</NavLink>

        </ul>
    )
}

export default withTranslation()(withRouter(DashboardNav))