import { Component } from "react"
import "./Navigation.css"
import { translate } from "../utils/langManager"

class Navigation extends Component {



    render() {
        return (
            <header>
                <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo" id="nav-logo" width={120} height={110} />
                <div className="nav-content">
                    <ul>
                        <li className="nav-link">{translate("nav.home")}</li>
                        <li className="nav-link"><a href="https://github.com/dd060606/OpenPasswordManager" target="_blank">GitHub</a></li>
                    </ul>

                </div>
            </header>)
    }
}

export default Navigation