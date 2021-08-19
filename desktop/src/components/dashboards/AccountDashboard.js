import { Component } from "react"
import DashboardNav from "./DashboardNav"
import "../css/dashboards/AccountDashboard.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import Loading from "../Loading"
import { isEmailSaved, saveEmail } from "../../utils/auth-utils"
import Swal from "sweetalert2"
import { isDarkTheme } from "../../utils/themes-utils"
import ChangePasswordBox from "./modal_box/ChangePasswordBox"

class AccountDashboard extends Component {

    state = {

        email: "email",
        lastname: "",
        firstname: "",
        isLoading: true,
    }

    componentDidMount() {
        const { isLoading } = this.state


        if (isLoading) {

            window.ipc.send("getAccountInfo")

        }
        window.ipc.receive("accountInfoResult", account => {
            this.setState({ isLoading: false, email: account.email, lastname: account.lastname, firstname: account.firstname })
            setTimeout(() => {
                const myAccount = document.querySelector(".my-account")
                myAccount.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
                myAccount.style.setProperty("--bg-theme", isDarkTheme() ? "#212121" : "white")
                myAccount.style.setProperty("--line-theme", isDarkTheme() ? "white" : "rgba(0,0,0,0.1)")
            }, 50)

        })
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
                    saveEmail("")
                }
                this.props.history.push("/auth/login")
            }
        })
        const swal2 = document.querySelector("#swal2-content")
        swal2.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
    }

    handleChangePasswordClick = () => {
        const changePasswordOverlay = document.querySelector(".change-password-overlay")
        changePasswordOverlay.style.visibility = "visible"
        changePasswordOverlay.style.opacity = 1
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
                        <ChangePasswordBox />

                    </div>

                }
            </>

        )
    }
}

export default withTranslation()(AccountDashboard)