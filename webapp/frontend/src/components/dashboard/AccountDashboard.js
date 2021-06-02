import { Component } from "react"
import DashboardNav from "./DashboardNav"
import "./css/AccountDashboard.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import Loading from "../Loading"
import axios from "axios"
import { deleteEmailCookie, isEmailSaved, readToken, sendToAuthPage } from "../../utils/auth-utils"
import Swal from "sweetalert2"

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
                        sendToAuthPage(this.props)
                    })
            }
            else {
                sendToAuthPage(this.props)
            }

        }
    }


    //Arrow fx for binding

    handleLogoutClick = () => {

        const { t } = this.props
        Swal.fire({
            text: t("account.want-to-logout"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#54c2f0",
            cancelButtonColor: "#d33",
            confirmButtonText: t("confirm"),
            cancelButtonText: t("cancel")
        }).then((result) => {
            if (result.isConfirmed) {
                if (isEmailSaved()) {
                    deleteEmailCookie()
                }
                sendToAuthPage(this.props)
            }
        })
    }

    handleChangePasswordClick = () => {
        (async () => {
            const { t } = this.props

            const { value: passwords } = await Swal.fire({
                title: t("account.change-password"),
                html:
                    `<input id="old-password" placeholder="${t("account.old-password")}" class="swal2-input">` +
                    `<input id="new-password" placeholder="${t("account.new-password")}" class="swal2-input">`,
                focusConfirm: false,
                confirmButtonColor: "#54c2f0",
                preConfirm: () => {
                    return [
                        document.getElementById("old-password").value,
                        document.getElementById("new-password").value
                    ]
                }
            })

            if (passwords) {
            }

        })()
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
                            <h1>{t("account.my-account")}</h1>
                            <span className="line" />

                            <section>
                                <h3>{t("information")}</h3>
                                <p><strong>Identifiant:</strong> {email}</p>
                            </section>
                            <span className="line" />

                            <section>
                                <h3>{t("security")}</h3>

                                <p></p>
                                <button className="change-password-button" onClick={this.handleChangePasswordClick}>{t("account.change-password")}</button>
                                <br />
                                <button className="logout-button" onClick={this.handleLogoutClick}>{t("account.logout")}</button>

                            </section>
                        </div>

                    </div>

                }
            </>

        )
    }
}

export default withTranslation()(AccountDashboard)