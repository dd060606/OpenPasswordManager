import { Component } from "react"
import "./css/Footer.css"
import { translate } from "../utils/langManager"

class Footer extends Component {


    render() {
        return (
            <footer>
                <a href="https://github.com/dd060606/OpenPasswordManager" rel="noopener noreferrer" target="_blank"><i className="fab fa-github" /> GitHub</a>
                <hr />
                <p className="message-cookies">{translate("essential-cookies")}</p>
                <hr />
                <p >{translate("created-by")} <strong>dd_06</strong></p>
            </footer >)
    }
}

export default Footer