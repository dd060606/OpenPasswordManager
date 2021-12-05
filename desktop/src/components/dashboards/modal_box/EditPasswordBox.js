
import "../../css/dashboards/modal_box/EditPasswordBox.css"
import { withTranslation } from "react-i18next"
import "../../../i18n"
import { Component } from "react"
import Swal from "sweetalert2"
import Checkbox from "@material-ui/core/Checkbox"
import Slider from "@material-ui/core/Slider"
import { isDarkTheme } from "../../../utils/themes-utils"
import { withRouter } from "react-router-dom"

class EditPasswordBox extends Component {


    state = {
        showPassword: false,
        password: "",
        url: "",
        websiteName: "",
        username: "",
        passwordFieldFocused: false,
        websiteFieldFocused: false,
        websiteNameFieldFocused: false,
        usernameFieldFocused: false,
        isLoading: false,
        passwordLength: 16,
        numbersEnabled: true,
        lowercasesEnabled: true,
        uppercaseEnabled: true,
        symbolsEnabled: true,
        generatedPassword: "",
        generatePasswordBoxOpened: false

    }
    constructor(props) {
        super(props)
        this.baseState = this.state

    }

    componentDidMount() {
        const editPasswordOverlay = document.querySelector(".edit-password-overlay")
        const overlayStyleObserver = new MutationObserver(mutations => {
            mutations.forEach(mutationRecord => {
                if (mutationRecord.target === editPasswordOverlay) {
                    if (editPasswordOverlay.style.visibility === "visible") {
                        this.setState({
                            websiteName: this.props.credential.name, url: this.props.credential.url,
                            username: this.props.credential.username, password: window.ipc.sendSync("decryptCredentialsPassword", this.props.credential.password)
                        })

                    }
                }
            });
        })
        overlayStyleObserver.observe(editPasswordOverlay, { attributes: true, attributeFilter: ['style'] });
        const editPassword = document.querySelector(".edit-password-box")
        editPassword.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        editPassword.style.setProperty("--bg-theme", isDarkTheme() ? "#333" : "white")
        editPassword.style.setProperty("--field-bg-theme", isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)")
        editPassword.style.setProperty("--bg-dropdown-theme", isDarkTheme() ? "#212121" : "white")


        window.ipc.receive("saveCredentialsResult", res => {
            const { t } = this.props

            if (res.result === "success") {
                this.setState({ isLoading: false })
                this.closeBox()
                this.reloadCredentials()
            }
            else {

                let errorMessage = t("errors.unknown-error")
                if (res.error) {
                    if (res.error.type === "internal-error") {
                        errorMessage = t("errors.internal-error")
                    } else if (res.error.type === "invalid-token") {
                        this.props.history.push("/auth/login")
                        return
                    }
                }
                this.openErrorBox(errorMessage)
            }
        })
        window.ipc.receive("deleteCredentialsResult", res => {
            const { t } = this.props
            if (res.result === "success") {
                this.setState({ isLoading: false })
                this.closeBox()
                this.reloadCredentials()

            }
            else {

                let errorMessage = t("errors.unknown-error")
                if (res.error) {
                    if (res.error.type === "internal-error") {
                        errorMessage = t("errors.internal-error")
                    } else if (res.error.type === "invalid-token") {
                        this.props.history.push("/auth/login")
                        return
                    }
                }
                this.openErrorBox(errorMessage)
            }
        })
    }

    openErrorBox(message) {
        const { t } = this.props
        Swal.fire({
            title: t("errors.error"),
            text: message,
            icon: "error",
            confirmButtonColor: "#54c2f0",
            background: isDarkTheme() ? " #333" : "white"
        }
        ).then(() => {
            this.setState({ isLoading: false })
        })
        const swal2 = document.querySelectorAll("#swal2-title, #swal2-content")
        swal2.forEach(element => {
            element.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        })
    }

    //Arrow fx for binding
    handleEditPasswordBoxClosed = event => {
        const editPasswordBox = document.querySelector(".edit-password-overlay")
        const closePasswordBoxButton = document.querySelector(".edit-password-box > .close")
        const cancelButton = document.querySelector(".edit-password-box .cancel-button")

        if (event.target === closePasswordBoxButton || event.target === cancelButton) {
            this.closeBox()
        }

        else if (event.target !== editPasswordBox) {
            return
        }
        this.closeBox()

    }

    closeBox() {
        const editPasswordOverlay = document.querySelector(".edit-password-overlay")
        editPasswordOverlay.style.visibility = "hidden"
        editPasswordOverlay.style.opacity = 0
        setTimeout(() => this.setState(this.baseState), 100)
    }

    reloadCredentials() {
        this.setState({ isLoading: true })


        window.ipc.send("loadCredentials")
    }

    handleSave = () => {
        const { websiteName, password, username, url } = this.state
        const { t } = this.props

        if (!websiteName) {
            this.openErrorBox(t("errors.enter-website-name"))
            return
        }
        this.setState({ isLoading: true })
        window.ipc.send("saveCredentials", { id: this.props.credential.id, websiteName: websiteName, password: password, username: username, url: url })
    }
    handleDelete = () => {
        const { t } = this.props
        Swal.fire({
            title: t("passwords.delete-password"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#54c2f0",
            cancelButtonColor: '#d33',
            confirmButtonText: t("confirm"),
            cancelButtonText: t("cancel"),
            background: isDarkTheme() ? " #333" : "white",
            iconColor: "#54c2f0"

        }).then((result) => {
            if (result.isConfirmed) {
                this.setState({ isLoading: true })
                window.ipc.send("deleteCredentials", this.props.credential.id)


            }
        })
        const swal2 = document.querySelectorAll("#swal2-title, #swal2-content")
        swal2.forEach(element => {
            element.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        })

    }

    handlePasswordLengthSliderChange = (event, newValue) => {
        const { passwordLength } = this.state
        if (passwordLength !== newValue) {
            this.setState({ passwordLength: newValue })

        }

    }

    handleUppercasesCheckboxClicked = () => {
        const { uppercaseEnabled, lowercasesEnabled, numbersEnabled, symbolsEnabled } = this.state

        if (lowercasesEnabled || numbersEnabled || symbolsEnabled) {
            this.setState({ uppercaseEnabled: !uppercaseEnabled })

        }

    }
    handleNumbersCheckboxClicked = () => {
        const { uppercaseEnabled, lowercasesEnabled, numbersEnabled, symbolsEnabled } = this.state
        if (lowercasesEnabled || uppercaseEnabled || symbolsEnabled) {
            this.setState({ numbersEnabled: !numbersEnabled })

        }

    }
    handleLowercasesCheckboxClicked = () => {
        const { uppercaseEnabled, lowercasesEnabled, numbersEnabled, symbolsEnabled } = this.state
        if (numbersEnabled || uppercaseEnabled || symbolsEnabled) {
            this.setState({ lowercasesEnabled: !lowercasesEnabled })

        }
    }
    handleSymbolsCheckboxClicked = () => {
        const { uppercaseEnabled, lowercasesEnabled, numbersEnabled, symbolsEnabled } = this.state
        if (numbersEnabled || uppercaseEnabled || lowercasesEnabled) {
            this.setState({ symbolsEnabled: !symbolsEnabled })
        }

    }
    getRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }
    generateRandomPassword = () => {
        const { passwordLength, numbersEnabled, lowercasesEnabled, uppercaseEnabled, symbolsEnabled } = this.state
        let generatedPassword = ""
        const specialsChars = [..."@$!%*#?&"]
        const letters = [..."abcdefghijklmnopqrstuvwxyz"]
        const numbers = [..."0123456789"]

        while (generatedPassword.length !== passwordLength) {
            const randomResult = this.getRandomNumber(4)
            if (generatedPassword.length === passwordLength - 1) {
                const containLowercase = /^(?=.*[a-z])[a-zA-Z\d@$!%*#?&_]{8,}$/
                const containUppercase = /^(?=.*[A-Z])[a-zA-Z\d@$!%*#?&_]{8,}$/
                const containSpecialChar = /^(?=.*[$!%*#?&_])[a-zA-Z\d@$!%*#?&_]{8,}$/
                const containNumber = /^(?=.*\d)[a-zA-Z\d@$!%*#?&_]{8,}$/
                if (!containLowercase.test(generatedPassword) && lowercasesEnabled) {
                    generatedPassword += letters[this.getRandomNumber(letters.length)]
                }
                else if (!containUppercase.test(generatedPassword) && uppercaseEnabled) {
                    generatedPassword += letters[this.getRandomNumber(letters.length)].toUpperCase()
                }
                else if (!containSpecialChar.test(generatedPassword) && symbolsEnabled) {
                    generatedPassword += specialsChars[this.getRandomNumber(specialsChars.length)]
                }
                else if (!containNumber.test(generatedPassword) && numbersEnabled) {
                    generatedPassword += numbers[this.getRandomNumber(numbers.length)]
                }
                break
            }
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
        this.setState({ password: generatedPassword, generatePasswordBoxOpened: false })
    }

    handleCloseGeneratePasswordBox = event => {
        const content = document.querySelector(".edit-password-box > .content")
        if (event.target !== content) {
            return
        }
        this.setState({ generatePasswordBoxOpened: false })
    }

    render() {
        const { showPassword, password, isLoading, url, websiteName, username, passwordFieldFocused, websiteFieldFocused, websiteNameFieldFocused, usernameFieldFocused
            , passwordLength, numbersEnabled, lowercasesEnabled, uppercaseEnabled, symbolsEnabled, generatePasswordBoxOpened } = this.state
        const { t } = this.props
        return (
            <div className="edit-password-overlay" onClick={event => this.handleEditPasswordBoxClosed(event)} >
                <div className="edit-password-box">
                    <button className="close">&times;</button>


                    <div className="content" onClick={event => this.handleCloseGeneratePasswordBox(event)}>
                        <img src={this.props.credential.largeImageURL} alt="" className="website-icon" onError={event => {
                            event.target.src = `${process.env.PUBLIC_URL}/assets/images/unknown_145x96.png`
                        }} />

                        <div className="fields">
                            <p className="field-name">{t("passwords.website-name")}</p>
                            <div className="field" style={{ border: websiteNameFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                                <input type="text" placeholder={t("passwords.website-name")}
                                    onBlur={() => this.setState({ websiteNameFieldFocused: false })}
                                    onFocus={() => this.setState({ websiteNameFieldFocused: true })} value={websiteName}
                                    onChange={event => this.setState({ websiteName: event.target.value })} autoCorrect="off" autoCapitalize="off" />


                            </div>
                        </div>
                        <div className="fields">
                            <p className="field-name">{t("passwords.website")}</p>
                            <div className="field" style={{ border: websiteFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                                <input type="text" placeholder={t("passwords.add-url")}
                                    onBlur={() => this.setState({ websiteFieldFocused: false })}
                                    onFocus={() => this.setState({ websiteFieldFocused: true })} value={url}
                                    onChange={event => this.setState({ url: event.target.value })} autoCorrect="off" autoCapitalize="off" />


                            </div>
                        </div>
                        <div className="fields">
                            <p className="field-name">{t("passwords.username")}</p>
                            <div className="field" style={{ border: usernameFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>
                                <input type="text" placeholder={t("passwords.username")}
                                    onBlur={() => this.setState({ usernameFieldFocused: false })}
                                    onFocus={() => this.setState({ usernameFieldFocused: true })} value={username}
                                    onChange={event => this.setState({ username: event.target.value })} autoCorrect="off" autoCapitalize="off" />


                            </div>
                        </div>
                        <div className="fields">
                            <p className="field-name">{t("auth.password")}</p>
                            <div className="field" style={{ border: passwordFieldFocused ? "1px #54c2f0 solid" : `1px ${isDarkTheme() ? "#212121" : "rgba(236, 236, 236, 0.8)"} solid` }}>


                                <div className="dropdown">
                                    <i className="fal fa-bolt fa-lg generate-password-btn" onClick={() => this.setState({ generatePasswordBoxOpened: true })} />
                                    <div className="dropdown-content" style={{ display: generatePasswordBoxOpened ? "flex" : "none" }}>
                                        <div className="gen-password-length-box">
                                            <p>{t("generator.password-length")}</p>
                                            <Slider valueLabelDisplay="auto" max={50} min={1} value={passwordLength} onChange={this.handlePasswordLengthSliderChange} />
                                        </div>
                                        <div className="gen-password-attributes-box">
                                            <div className="gen-box1">
                                                <div className="gen-attribute">

                                                    <Checkbox style={{
                                                        color: "#54c2f0",
                                                        transform: "scale(1.2)",
                                                        backgroundColor: "transparent"
                                                    }} checked={uppercaseEnabled} onClick={this.handleUppercasesCheckboxClicked} />
                                                    <p onClick={this.handleUppercasesCheckboxClicked} >{t("generator.uppercases")}</p>

                                                </div>

                                                <div className="gen-attribute">

                                                    <Checkbox style={{
                                                        color: "#54c2f0",
                                                        transform: "scale(1.2)",
                                                        backgroundColor: "transparent"

                                                    }} checked={lowercasesEnabled} onClick={this.handleLowercasesCheckboxClicked} />
                                                    <p onClick={this.handleLowercasesCheckboxClicked} >{t("generator.lowercases")}</p>

                                                </div>
                                            </div>

                                            <div className="gen-box2">
                                                <div className="gen-attribute">

                                                    <Checkbox style={{
                                                        color: "#54c2f0",
                                                        transform: "scale(1.2)",
                                                        backgroundColor: "transparent"
                                                    }} checked={numbersEnabled} onClick={this.handleNumbersCheckboxClicked} />
                                                    <p onClick={this.handleNumbersCheckboxClicked} >{t("generator.numbers")}</p>

                                                </div>
                                                <div className="gen-attribute">

                                                    <Checkbox style={{
                                                        color: "#54c2f0",
                                                        transform: "scale(1.2)",
                                                        backgroundColor: "transparent"
                                                    }} checked={symbolsEnabled} onClick={this.handleSymbolsCheckboxClicked} />
                                                    <p onClick={this.handleSymbolsCheckboxClicked} >{t("generator.symbols")}</p>

                                                </div>

                                            </div>

                                        </div>
                                        <button className="gen-button" onClick={this.generateRandomPassword}>{t("generator.generate")}</button>
                                    </div>

                                </div>

                                <input type={showPassword ? "text" : "password"} placeholder={t("auth.password")}
                                    onBlur={() => this.setState({ passwordFieldFocused: false })}
                                    onFocus={() => this.setState({ passwordFieldFocused: true })} value={password}
                                    onChange={event => this.setState({ password: event.target.value })} autoCorrect="off" autoCapitalize="off" />

                                <i className={`fal ${showPassword ? "fa-eye" : "fa-eye-slash"} fa-lg`} onClick={() => { this.setState({ showPassword: !showPassword }) }} />

                            </div>
                        </div>
                        <div className="buttons">
                            <button className="save-password-button" disabled={isLoading} onClick={this.handleSave} >{isLoading ? <i className="fad fa-spinner-third fa-spin" /> : t("save")}</button>
                            <div>
                                <button className="cancel-button">{t("cancel")}</button>
                                <button className="delete-button" onClick={this.handleDelete}><i className="far fa-trash-alt" /></button>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(withRouter(EditPasswordBox))