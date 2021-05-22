import { Component } from "react"
import DashboardNav from "./DashboardNav"
import "./css/GeneratorDashboard.css"
import { withTranslation } from 'react-i18next'
import "../../i18n"
import Tooltip from '@material-ui/core/Tooltip';





class GeneratorDashboard extends Component {

    state = {
        passwordStrengthValue: 100,
        generatedPassword: "",
        passwordLength: 16,
        passwordCopied: false
    }


    componentDidMount() {
        this.generatePassword()
    }

    getRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }

    //Arrow fx for binding
    handlePasswordChange = password => {
        const containUpper = /^(?=.*[A-Z])[a-zA-Z\d@$!%*_?&]{8,}$/
        const containLower = /^(?=.*[a-z])[a-zA-Z\d@$!%*_?&]{8,}$/
        const containNumber = /^(?=.*\d)[a-zA-Z\d@$!%*_?&]{8,}$/
        if (password.length < 8) {
            this.setState({ passwordStrengthValue: 15 })
        }
        else if (password.length <= 12) {
            if (containUpper.test(password) && containLower.test(password) && !containNumber.test(password)) {
                this.setState({ passwordStrengthValue: 50 })
            }
            else if (containUpper.test(password) && containLower.test(password) && containNumber.test(password)) {
                this.setState({ passwordStrengthValue: 70 })
            }
            else {
                this.setState({ passwordStrengthValue: 30 })
            }
        }
        else if (password.length < 14) {
            if (containUpper.test(password) && containLower.test(password) && containNumber.test(password)) {
                this.setState({ passwordStrengthValue: 70 })
            }
            else {
                this.setState({ passwordStrengthValue: 50 })
            }
        }
        else {
            if (containUpper.test(password) && containLower.test(password) && containNumber.test(password)) {
                this.setState({ passwordStrengthValue: 100 })
            }
            else {
                this.setState({ passwordStrengthValue: 70 })
            }

        }

        this.setState({ generatedPassword: password })
    }

    generatePassword = () => {
        const { passwordLength } = this.state
        let generatedPassword = ""
        const specialsChars = [..."@$!%*_?&"]
        const letters = [..."abcdefghijklmnopqrstuvwxyz"]
        const numbers = [..."0123456789"]

        while (generatedPassword.length !== passwordLength) {
            const randomResult = this.getRandomNumber(3)

            if (randomResult === 0) {
                generatedPassword += specialsChars[this.getRandomNumber(specialsChars.length)]
            }
            else if (randomResult === 1) {
                if (this.getRandomNumber(2) === 0) {
                    generatedPassword += letters[this.getRandomNumber(letters.length)].toUpperCase()
                }
                else {
                    generatedPassword += letters[this.getRandomNumber(letters.length)]
                }
            }
            else {
                generatedPassword += numbers[this.getRandomNumber(numbers.length)]

            }
        }
        this.setState({ generatedPassword: generatedPassword })
        this.handlePasswordChange(generatedPassword)
    }


    copyPassword = () => {
        const { generatedPassword, passwordCopied } = this.state
        navigator.clipboard.writeText(generatedPassword)

        if (!passwordCopied) {
            this.setState({ passwordCopied: true })

            setTimeout(() => {
                this.setState({ passwordCopied: false })
            }, 1000)
        }

    }

    render() {
        const { t } = this.props
        const { passwordStrengthValue, generatedPassword, passwordCopied } = this.state
        return (


            <div className="generator">
                <DashboardNav />

                <div className="generator-content">
                    <h1>{t("generator.password-generator")}</h1>
                    <p className="use-generator-text">{t("generator.use-generator")}</p>

                    <div className="generated-password-box">
                        <div className="password-field">
                            <input type="text" spellCheck={false} value={generatedPassword} onChange={event => this.handlePasswordChange(event.target.value)} />
                            <div className="buttons">
                                <Tooltip title={!passwordCopied ? t("copy") : t("copied") + " ✔"} placement="right">
                                    <i className="fal fa-copy button" onClick={this.copyPassword} />
                                </Tooltip>
                                <Tooltip title={t("generator.generate")} placement="right">
                                    <i className="fal fa-sync button" onClick={this.generatePassword} />
                                </Tooltip>
                            </div>
                        </div>
                        <div className="password-strength-bar">
                            <div className="progress-bar" style={{ width: `${passwordStrengthValue}%`, backgroundColor: passwordStrengthValue === 15 ? "#F02A0B" : passwordStrengthValue === 30 ? "#F0680B" : passwordStrengthValue === 50 ? "#82F00B" : "#0BF06B" }} />
                        </div>

                    </div>
                </div>

            </div>


        )
    }
}

export default withTranslation()(GeneratorDashboard)