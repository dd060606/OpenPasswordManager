import { Component } from "react"
import "./css/Footer.css"
import { translate } from "../utils/langManager"

class Footer extends Component {


    render() {
        return (
            <footer>
                <a href="https://github.com/dd060606/OpenPasswordManager" target="_blank">GitHub</a>
                <hr />
                <p>{translate("created-by")} dd_06</p>
            </footer>)
    }
}

export default Footer