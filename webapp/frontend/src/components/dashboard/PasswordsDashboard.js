import { Component } from "react"
import "./css/PasswordsDashboard.css"
import DashboardNav from "./DashboardNav"
import Loading from "../Loading"
import { withTranslation } from 'react-i18next'
import "../../i18n"


class PasswordsDashboard extends Component {

    state = {

        isLoading: true,
        token: "",

    }

    componentDidMount() {
        const { isLoading } = this.state

        if (isLoading) {
            this.setState({ isLoading: false })
        }
    }
    render() {
        const { isLoading } = this.state
        const { t } = this.props
        return (
            <>
                { isLoading && <Loading />}
                {
                    !isLoading &&
                    <div className="my-passwords">
                        <DashboardNav />

                        <div className="passwords-content">
                            <nav>
                                <button id="add-password-button"><i className="fas fa-plus" /> {t("passwords.add")}</button>
                                <div className="search-bar">
                                    <i className="fas fa-search" />
                                    <input type="text" placeholder={t("search")} />
                                </div>
                            </nav>

                            <div className="password-list">
                                <div className="no-passwords">
                                    <i className="fal fa-lock-alt" />
                                    <h3 style={{ textAlign: "center" }}>{t("passwords.no-passwords")}</h3>
                                </div>


                            </div>
                        </div>

                    </div>
                }
            </>

        )
    }
}

export default withTranslation()(PasswordsDashboard)