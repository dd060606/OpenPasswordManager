import { Component } from "react"
import DashboardNav from "./DashboardNav"
import "./css/AccountDashboard.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import Loading from "../Loading"
import axios from "axios"
import { deleteEmailCookie, isEmailSaved, readToken, sendToAuthPage } from "../../utils/auth-utils"
import Swal from "sweetalert2"
import { isDarkTheme } from "../../utils/themes-utils"

class AccountDashboard extends Component {

    state = {

        email: "email",
        lastname: "",
        firstname: "",
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
                        this.setState({ isLoading: false, token: token, email: result.data.email, lastname: result.data.lastname, firstname: result.data.firstname })
                        const myAccount = document.querySelector(".my-account")
                        myAccount.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
                        myAccount.style.setProperty("--bg-theme", isDarkTheme() ? "#212121" : "white")
                        myAccount.style.setProperty("--line-theme", isDarkTheme() ? "white" : "rgba(0,0,0,0.1)")


                    })
                    .catch(err => {
                        sendToAuthPage(this.props)
                        console.log(err)
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
            cancelButtonText: t("cancel"),
            background: isDarkTheme() ? " #333" : "white",
            iconColor: "#54c2f0"
        }).then((result) => {
            if (result.isConfirmed) {
                if (isEmailSaved()) {
                    deleteEmailCookie()
                }
                sendToAuthPage(this.props)
            }
        })
        const swal2 = document.querySelector("#swal2-content")
        swal2.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
    }

    handleChangePasswordClick = () => {

    }

    render() {
        const { t } = this.props
        const { email, isLoading, lastname, firstname } = this.state
        return (

            <>
                {isLoading && <Loading />}
                {
                    !isLoading &&
                    <div className="my-account">
                        <DashboardNav />

                        <div className="my-account-content">
                            <h1>{t("account.my-account")}</h1>
                            <span className="line" />

                            <section>
                                <h3>{t("information")}</h3>
                                <p><strong>{t("account.username")} : </strong> {email}</p>
                                <p><strong>{t("account.firstname")} : </strong> {firstname}</p>
                                <p><strong>{t("account.lastname")} : </strong> {lastname}</p>

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