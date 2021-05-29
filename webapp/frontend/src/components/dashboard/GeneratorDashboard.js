import { Component } from "react"
import DashboardNav from "./DashboardNav"
import "./css/GeneratorDashboard.css"
import { withTranslation } from "react-i18next"
import "../../i18n"
import Tooltip from "@material-ui/core/Tooltip"
import Checkbox from "@material-ui/core/Checkbox"
import Slider from "@material-ui/core/Slider"






class GeneratorDashboard extends Component {

    state = {
        passwordStrengthValue: 100,
        generatedPassword: "",
        passwordLength: 16,
        passwordCopied: false,
        numbersEnabled: true,
        lowercasesEnabled: true,
        uppercaseEnabled: true,
        symbolsEnabled: true
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

        const { passwordLength, numbersEnabled, lowercasesEnabled, uppercaseEnabled, symbolsEnabled } = this.state
        let generatedPassword = ""
        const specialsChars = [..."@$!%*#?&"]
        const letters = [..."abcdefghijklmnopqrstuvwxyz"]
        const numbers = [..."0123456789"]

        while (generatedPassword.length !== passwordLength) {
            const randomResult = this.getRandomNumber(4)

            if (randomResult === 0) {
                if (symbolsEnabled) {
                    generatedPassword += specialsChars[this.getRandomNumber(specialsChars.length)]
                }
            }
            else if (randomResult === 1) {
                if (uppercaseEnabled) {
                    generatedPassword += letters[this.getRandomNumber(letters.length)].toUpperCase()

                }
            }
            else if (randomResult === 2) {
                if (lowercasesEnabled) {
                    generatedPassword += letters[this.getRandomNumber(letters.length)]

                }
            }
            else {
                if (numbersEnabled) {
                    generatedPassword += numbers[this.getRandomNumber(numbers.length)]

                }

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

    handlePasswordLengthSliderChange = (event, newValue) => {
        const { passwordLength } = this.state
        if (passwordLength !== newValue) {
            setTimeout(() => {
                this.generatePassword()
            }, 1)
        }
        this.setState({ passwordLength: newValue })

    }

    handleUppercasesCheckboxClicked = () => {
        const { uppercaseEnabled, lowercasesEnabled, numbersEnabled, symbolsEnabled } = this.state

        if (lowercasesEnabled || numbersEnabled || symbolsEnabled) {
            this.setState({ uppercaseEnabled: !uppercaseEnabled })
            setTimeout(() => {
                this.generatePassword()
            }, 50)
        }

    }
    handleNumbersCheckboxClicked = () => {
        const { uppercaseEnabled, lowercasesEnabled, numbersEnabled, symbolsEnabled } = this.state
        if (lowercasesEnabled || uppercaseEnabled || symbolsEnabled) {
            this.setState({ numbersEnabled: !numbersEnabled })
            setTimeout(() => {
                this.generatePassword()
            }, 1)
        }

    }
    handleLowercasesCheckboxClicked = () => {
        const { uppercaseEnabled, lowercasesEnabled, numbersEnabled, symbolsEnabled } = this.state
        if (numbersEnabled || uppercaseEnabled || symbolsEnabled) {
            this.setState({ lowercasesEnabled: !lowercasesEnabled })
            setTimeout(() => {
                this.generatePassword()
            }, 1)
        }
    }
    handleSymbolsCheckboxClicked = () => {
        const { uppercaseEnabled, lowercasesEnabled, numbersEnabled, symbolsEnabled } = this.state
        if (numbersEnabled || uppercaseEnabled || lowercasesEnabled) {
            this.setState({ symbolsEnabled: !symbolsEnabled })
            setTimeout(() => {
                this.generatePassword()
            }, 1)
        }

    }


    render() {
        const { t } = this.props
        const { passwordStrengthValue, generatedPassword, passwordCopied, passwordLength, numbersEnabled, lowercasesEnabled, uppercaseEnabled, symbolsEnabled } = this.state
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

                    <div className="generator-config">
                        <h2>{t("generator.configure-password")}</h2>

                        <div className="configure-box">
                            <div className="password-length-box">
                                <p>{t("generator.password-length")}</p>
                                <Slider valueLabelDisplay="auto" max={50} min={1} value={passwordLength} onChange={this.handlePasswordLengthSliderChange} />

                            </div>
                            <div className="password-attributes-box">
                                <div className="box1">
                                    <div className="attribute">

                                        <Checkbox style={{
                                            color: "#54c2f0",
                                            transform: "scale(1.5)"
                                        }} checked={uppercaseEnabled} onClick={this.handleUppercasesCheckboxClicked} />
                                        <p onClick={this.handleUppercasesCheckboxClicked} >{t("generator.uppercases")}</p>

                                    </div>

                                    <div className="attribute">

                                        <Checkbox style={{
                                            color: "#54c2f0",
                                            transform: "scale(1.5)"

                                        }} checked={lowercasesEnabled} onClick={this.handleLowercasesCheckboxClicked} />
                                        <p onClick={this.handleLowercasesCheckboxClicked} >{t("generator.lowercases")}</p>

                                    </div>
                                </div>

                                <div className="box2">
                                    <div className="attribute">

                                        <Checkbox style={{
                                            color: "#54c2f0",
                                            transform: "scale(1.5)"
                                        }} checked={numbersEnabled} onClick={this.handleNumbersCheckboxClicked} />
                                        <p onClick={this.handleNumbersCheckboxClicked} >{t("generator.numbers")}</p>

                                    </div>
                                    <div className="attribute">

                                        <Checkbox style={{
                                            color: "#54c2f0",
                                            transform: "scale(1.5)"
                                        }} checked={symbolsEnabled} onClick={this.handleSymbolsCheckboxClicked} />
                                        <p onClick={this.handleSymbolsCheckboxClicked} >{t("generator.symbols")}</p>

                                    </div>
                                </div>


                            </div>
                        </div>

                    </div>
                </div>



            </div>


        )
    }
}

export default withTranslation()(GeneratorDashboard)