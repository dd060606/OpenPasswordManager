import { Component } from "react"
import "./css/DashboardNav.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import { withRouter } from "react-router"
import { NavLink } from "react-router-dom"

class DashboardNav extends Component {

    state = {
        navOpened: true
    }


    //Arrow fx for binding

    handleNavOpened = () => {
        const { navOpened } = this.state
        this.setState({ navOpened: !navOpened })


    }

    handleMyAccountClicked = () => {

        this.props.history.push("/dashboard/my-account")
    }

    render() {
        const { navOpened } = this.state
        const { t } = this.props
        return (
            <div className={`dashboard-nav ${!navOpened ? "nav-closed" : ""}`}>
                <div className="top-buttons" style={{ flexDirection: navOpened ? "row" : "column" }}>
                    <i className="fas fa-bars open-nav-button top-button" onClick={this.handleNavOpened} />
                    <i className="fas fa-user-circle open-account-settings top-button" title="Mon compte" onClick={this.handleMyAccountClicked} />

                </div>

                <div className="nav-buttons">
                    <NavLink to="/dashboard/passwords" className="nav-button" activeClassName="current-link"><i className="far fa-lock-alt" />{navOpened ? t("my-passwords") : ""}</NavLink>
                    <NavLink to="/dashboard/generator" className="nav-button" activeClassName="current-link"><i className="far fa-bolt" />{navOpened ? t("generator") : ""}</NavLink>
                    <NavLink to="/dashboard/settings" className="nav-button" activeClassName="current-link"><i className="far fa-cog" />{navOpened ? t("settings") : ""}</NavLink>
                </div>

            </div>
        )
    }

}

export default withTranslation()(withRouter(DashboardNav))