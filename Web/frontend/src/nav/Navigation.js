import { Component } from "react"
import "./Navigation.css"
import { translate } from "../utils/langManager"
import { NavLink } from "react-router-dom"
import { DropdownButton, Dropdown } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';


class Navigation extends Component {



    render() {
        return (
            <header>
                <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo" id="nav-logo" width={120} height={110} />
                <div className="nav-content">
                    <ul>
                        <NavLink className="navlink" exact activeClassName="current" to="/">
                            <li className="navlink">{translate("nav-home")}</li>
                        </NavLink>

                        <NavLink className="navlink" exact activeClassName="current" to="/Downloads">
                            <li className="navlink">{translate("downloads")}</li>
                        </NavLink>

                        <a href="https://github.com/dd060606/OpenPasswordManager" target="_blank"><li className="external-link">GitHub</li></a>


                        <DropdownButton id="language-selector-btn" title={<i class="fas fa-globe fa-2x" />}>
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item>Another action</Dropdown.Item>
                            <Dropdown.Item>Something else</Dropdown.Item>
                        </DropdownButton>

                    </ul>

                </div>
            </header>)
    }
}

export default Navigation