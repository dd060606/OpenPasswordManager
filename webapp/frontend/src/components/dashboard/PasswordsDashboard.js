import { Component } from "react"
import "./css/PasswordsDashboard.css"
import DashboardNav from "./DashboardNav"
import Loading from "../Loading"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import PasswordItem from "./passwords/PasswordItem"
import { readToken, sendToAuthPage } from "../../utils/auth-utils"
import axios from "axios"
import Swal from "sweetalert2"

class PasswordsDashboard extends Component {

    state = {

        isLoading: true,
        token: "",
        passwords: [],
        search: ""

    }

    componentDidMount() {
        const { isLoading } = this.state
        const { t } = this.props
        this.setState({ token: readToken(this.props) })
        if (isLoading) {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/api/credentials/`, { headers: { "Authorization": `Bearer ${readToken(this.props)}` } })
                .then(result => {
                    let finalCredentials = []
                    for (let i = 0; i < result.data.credentials.length; i++) {
                        result.data.credentials[i].imageURL = `https://d2erpoudwvue5y.cloudfront.net/_46x30/${this.extractDomainFromURL(result.data.credentials[i].url).replaceAll(".", "_")}@2x.png`
                        finalCredentials.push(result.data.credentials[i])
                    }
                    this.setState({ isLoading: false, passwords: result.data.credentials })
                })
                .catch(err => {
                    if (err.response && err.response.data) {
                        if (err.response.data.type === "internal-error") {
                            Swal.fire({
                                title: t("errors.error"),
                                text: t("errors.internal-error"),
                                icon: "error",
                                confirmButtonColor: "#54c2f0"
                            })
                        } else if (err.response.data.type === "invalid-token") {
                            sendToAuthPage(this.props)
                        }
                        else {
                            Swal.fire({
                                title: t("errors.error"),
                                text: t("errors.unknown-error"),
                                icon: "error",
                                confirmButtonColor: "#54c2f0"
                            })
                        }
                    }
                    else {
                        Swal.fire({
                            title: t("errors.error"),
                            text: t("errors.unknown-error"),
                            icon: "error",
                            confirmButtonColor: "#54c2f0"
                        })
                    }
                })
        }
    }

    extractHostname(url) {
        let hostname

        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2]
        }
        else {
            hostname = url.split('/')[0]
        }

        hostname = hostname.split(':')[0]
        hostname = hostname.split('?')[0]

        return hostname
    }
    extractDomainFromURL(url) {
        let domain = this.extractHostname(url),
            splitArr = domain.split('.'),
            arrLen = splitArr.length

        if (arrLen > 2) {
            domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1]
            if (splitArr[arrLen - 2].length === 2 && splitArr[arrLen - 1].length === 2) {
                domain = splitArr[arrLen - 3] + '.' + domain
            }
        }
        return domain
    }

    //Arrow fx for binding
    handlePasswordClick = () => {

    }

    render() {
        const { isLoading, passwords, search, token } = this.state
        const { t } = this.props
        return (
            <>
                { isLoading && <Loading />}
                {
                    !isLoading &&
                    <div className="my-passwords">
                        <DashboardNav token={token} />

                        <div className="passwords-content">
                            <nav>
                                <button id="add-password-button"><i className="fas fa-plus" /> {t("passwords.add")}</button>
                                <div className="search-bar">
                                    <i className="fas fa-search" />
                                    <input type="text" placeholder={t("search")} value={search} onChange={event => this.setState({ search: event.target.value })} />
                                </div>
                            </nav>

                            <div className="password-list" style={{ justifyContent: passwords.length === 0 ? "center" : "" }}>
                                {passwords.length === 0 &&
                                    <div className="no-passwords">
                                        <i className="fal fa-lock-alt" />
                                        <h3>{t("passwords.no-passwords")}</h3>
                                    </div>
                                }
                                {passwords.length !== 0 &&


                                    passwords.map((password, index) => {
                                        if (password.url.toLowerCase().includes(search.toLowerCase()) || password.name.toLowerCase().includes(search.toLowerCase())) {
                                            return <PasswordItem url={password.url} index={index} key={index} onClick={this.handlePasswordClick} imageUrl={password.imageURL} name={password.name} />

                                        }
                                        return <></>

                                    })

                                }
                            </div>
                        </div>

                    </div>
                }
            </>

        )
    }
}

export default withTranslation()(PasswordsDashboard)