import { Component } from "react"
import "./css/PasswordsDashboard.css"
import DashboardNav from "./DashboardNav"
import Loading from "../Loading"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import PasswordItem from "./passwords/PasswordItem"


class PasswordsDashboard extends Component {

    state = {

        isLoading: true,
        token: "",
        passwords: [
            {
                url: "https://amazon.com",
                imageUrl: "https://d2erpoudwvue5y.cloudfront.net/_46x30/amazon_com@2x.png",
                name: "Amazon"
            },
            {
                url: "https://ebay.com",
                imageUrl: "https://d2erpoudwvue5y.cloudfront.net/_46x30/ebay_com@2x.png",
                name: "E-Bay"
            },
            {
                url: "https://nintendo.com",
                imageUrl: "https://d2erpoudwvue5y.cloudfront.net/_46x30/nintendo_com@2x.png",
                name: "Nintendo"
            }
        ],
        search: ""

    }

    componentDidMount() {
        const { isLoading } = this.state

        if (isLoading) {
            this.setState({ isLoading: false })
        }
    }

    //Arrow fx for binding
    handlePasswordClick = () => {

    }

    render() {
        const { isLoading, passwords, search } = this.state
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
                                            return <PasswordItem url={password.url} index={index} key={index} onClick={this.handlePasswordClick} imageUrl={password.imageUrl} name={password.name} />

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