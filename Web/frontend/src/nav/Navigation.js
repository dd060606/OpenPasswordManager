import { Component } from "react"
import "./Navigation.css"
import { translate, setLangJSON, setLanguage } from "../utils/langManager"
import { NavLink } from "react-router-dom"
import { DropdownButton, Dropdown } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import { updateRender, cookies } from "../index"



class Navigation extends Component {

    state = {
        allLanguages: ["English", "Français"],
        currentLanguage: "en"
    }


    //Arrow fx for binding
    handleLanguageSelected = index => {
        const { currentLanguage, allLanguages } = this.state

        fetch('assets/langs/' + allLanguages[index].substring(0, 2).toLowerCase() + '.json', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(res => res.json())
            .then(json => {
                setLangJSON(json)
                setLanguage(allLanguages[index].substring(0, 2).toLowerCase())
                cookies.set('language', allLanguages[index].substring(0, 2).toLowerCase(), { path: '/' });
                updateRender()

                this.setState({
                    currentLanguage: allLanguages[index].substring(0, 2).toLowerCase()
                })
            })



        console.log("Switched to " + allLanguages[index])

    }


    render() {
        const { allLanguages } = this.state
        return (
            <header>
                <div className="nav-content">
                    <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="nav-logo" id="nav-logo" width={120} height={110} />

                    <ul>
                        <NavLink className="navlink " exact activeClassName="current" to="/">
                            <li className="navlink link-underline">{translate("nav-home")}</li>
                        </NavLink>

                        <NavLink className="navlink" exact activeClassName="current" to="/Downloads">
                            <li className="navlink  link-underline">{translate("downloads")}</li>
                        </NavLink>

                        <a href="https://github.com/dd060606/OpenPasswordManager" target="_blank"><li className="external-link link-underline">GitHub</li></a>
                    </ul>

                    <div>
                        <button className="my-password-manager-btn">{translate("my-password-manager")}</button>
                        <DropdownButton id="language-selector-btn" title={<i className="fas fa-globe fa-2x" />}>
                            {allLanguages.map((language, index) => (
                                <Dropdown.Item onClick={() => this.handleLanguageSelected(index)} key={index}>{language}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>

                </div>


            </header >)
    }
}

export default Navigation