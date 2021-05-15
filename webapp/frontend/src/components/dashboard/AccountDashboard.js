import { Component } from "react"
import DashboardNav from "./DashboardNav"
import "./css/AccountDashboard.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import Loading from "../Loading"
import axios from "axios"
import { readToken } from "../../utils/auth-utils"

class AccountDashboard extends Component {

    state = {

        email: "email",
        isLoading: true,
        token: ""
    }

    componentDidMount() {
        const { isLoading } = this.state

        if (isLoading) {
            const token = readToken(this.props)
            if (token) {
                axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/info`, { headers: { "Authorization": `Bearer ${token}` } })
                    .then(result => {
                        this.setState({ isLoading: false, token: token, email: result.data.email })
                    })
                    .catch(err => {
                        this.props.history.push("/auth/login")
                    })
            }
            else {
                this.props.history.push("/")
            }

        }
    }
    render() {
        const { t } = this.props
        const { email, isLoading } = this.state
        return (

            <>
                { isLoading && <Loading />}
                {
                    !isLoading &&
                    <div className="my-account">
                        <DashboardNav />

                        <div className="my-account-content">
                            <h2>{t("account.my-account")}</h2>
                            <span className="line" />

                            <section>
                                <h3>{t("information")}</h3>
                                <p><strong>Identifiant:</strong> {email}</p>
                            </section>
                            <span className="line" />

                            <section>
                                <h3>{t("security")}</h3>

                                <button className="change-password-button">{t("account.change-password")}</button>
                            </section>
                        </div>

                    </div>

                }
            </>

        )
    }
}

export default withTranslation()(AccountDashboard)