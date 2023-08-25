
import "../../css/dashboards/modal_box/EditPasswordBox.css"
import { withTranslation } from "react-i18next"
import "../../../i18n"
import { Component } from "react"
import { withRouter } from "react-router-dom"
import CryptoJS from "crypto-js"
import Swal from "sweetalert2"
import axios from "axios"
import { sendToAuthPage } from "../../../utils/auth-utils"
import { Tooltip, Slider, Checkbox } from "@material-ui/core"
import { isDarkTheme } from "../../../utils/themes-utils"
import { extractRootDomain } from "../../../utils/credentials-utils"


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
        passwordLength: 20,
        numbersEnabled: true,
        lowercasesEnabled: true,
        uppercaseEnabled: true,
        symbolsEnabled: true,
        generatedPassword: "",
        generatePasswordBoxOpened: false,
        passwordCopied: false,
        imageError: false

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
                        this.setState({ websiteName: this.props.credential.name, url: this.props.credential.url, username: this.props.credential.username, password: CryptoJS.AES.decrypt(this.props.credential.password, this.props.password).toString(CryptoJS.enc.Utf8) })
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
        const { t } = this.props
        this.setState({ isLoading: true })
        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/credentials/`, { headers: { "Authorization": `Bearer ${this.props.token}` } })
            .then(result => {
                let finalCredentials = []
                for (let i = 0; i < result.data.credentials.length; i++) {
                    result.data.credentials[i].smallImageURL = `https://logo.clearbit.com/${extractRootDomain(result.data.credentials[i].url)}?size=50`
                    result.data.credentials[i].largeImageURL = `https://logo.clearbit.com/${extractRootDomain(result.data.credentials[i].url)}?size=100`

                    finalCredentials.push(result.data.credentials[i])
                }

                this.props.reloadCredentials(finalCredentials)
                this.setState({ isLoading: false })
            })
            .catch(err => {
                let errorMessage = t("errors.unknown-error")
                if (err.response && err.response.data) {
                    if (err.response.data.type === "internal-error") {
                        errorMessage = t("errors.internal-error")
                    }
                }
                this.openErrorBox(errorMessage)
            })
    }

    handleSave = () => {
        const { websiteName, password, username, url } = this.state
        const { t } = this.props

        if (!websiteName) {
            this.openErrorBox(t("errors.enter-website-name"))
            return
        }
        this.setState({ isLoading: true })
        let encryptedPassword = CryptoJS.AES.encrypt(password, this.props.password).toString()
        axios.put(`${process.env.REACT_APP_SERVER_URL}/api/credentials/edit/${this.props.credential.id}`, {
            username: username,
            password: encryptedPassword,
            name: websiteName,
            url: url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`
        }, { headers: { "Authorization": `Bearer ${this.props.token}` } })
            .then(result => {
                this.setState({ isLoading: false })
                this.closeBox()
                this.reloadCredentials()
            })
            .catch(err => {
                let errorMessage = t("errors.unknown-error")
                if (err.response && err.response.data) {
                    if (err.response.data.type === "internal-error") {
                        errorMessage = t("errors.internal-error")
                    } else if (err.response.data.type === "invalid-token") {
                        sendToAuthPage(this.props)
                        return
                    }
                }
                this.openErrorBox(errorMessage)
            })
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
                axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/credentials/delete/${this.props.credential.id}`, { headers: { "Authorization": `Bearer ${this.props.token}` } })
                    .then(result => {
                        this.setState({ isLoading: false })
                        this.closeBox()
                        this.reloadCredentials()

                    })
                    .catch(err => {
                        let errorMessage = t("errors.unknown-error")

                        if (err.response && err.response.data) {
                            if (err.response.data.type === "internal-error") {
                                errorMessage = t("errors.internal-error")
                            } else if (err.response.data.type === "invalid-token") {
                                sendToAuthPage(this.props)
                                return
                            }
                        }
                        this.openErrorBox(errorMessage)

                    })
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

    copyPassword = () => {
        const { passwordCopied, password } = this.state
        navigator.clipboard.writeText(password)

        if (!passwordCopied) {
            this.setState({ passwordCopied: true })

            setTimeout(() => {
                this.setState({ passwordCopied: false })
            }, 1000)
        }

    }

    render() {
        const { showPassword, password, isLoading, url, websiteName, username, passwordFieldFocused, websiteFieldFocused, websiteNameFieldFocused, usernameFieldFocused
            , passwordLength, numbersEnabled, lowercasesEnabled, uppercaseEnabled, symbolsEnabled, generatePasswordBoxOpened, passwordCopied, imageError } = this.state
        const { t } = this.props

        return (
            <div className="edit-password-overlay" onClick={event => this.handleEditPasswordBoxClosed(event)} >
                <div className="edit-password-box">
                    <button className="close">&times;</button>


                    <div className="content" onClick={event => this.handleCloseGeneratePasswordBox(event)}>
                        {!imageError && <img src={this.props.credential.largeImageURL} alt="" className="website-icon" onError={event => this.setState({ imageError: true })} />
                        }
                        {imageError && <div className="website-icon" id="no-img-box">
                            <p>{websiteName ? websiteName[0].toUpperCase() + (websiteName.length >= 2 ? websiteName[1] : "") : ""}</p>
                        </div>}
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
                                                        transform: "scale(1.2)"
                                                    }} checked={uppercaseEnabled} onClick={this.handleUppercasesCheckboxClicked} />
                                                    <p onClick={this.handleUppercasesCheckboxClicked} >{t("generator.uppercases")}</p>

                                                </div>

                                                <div className="gen-attribute">

                                                    <Checkbox style={{
                                                        color: "#54c2f0",
                                                        transform: "scale(1.2)"

                                                    }} checked={lowercasesEnabled} onClick={this.handleLowercasesCheckboxClicked} />
                                                    <p onClick={this.handleLowercasesCheckboxClicked} >{t("generator.lowercases")}</p>

                                                </div>
                                            </div>

                                            <div className="gen-box2">
                                                <div className="gen-attribute">

                                                    <Checkbox style={{
                                                        color: "#54c2f0",
                                                        transform: "scale(1.2)"
                                                    }} checked={numbersEnabled} onClick={this.handleNumbersCheckboxClicked} />
                                                    <p onClick={this.handleNumbersCheckboxClicked} >{t("generator.numbers")}</p>

                                                </div>
                                                <div className="gen-attribute">

                                                    <Checkbox style={{
                                                        color: "#54c2f0",
                                                        transform: "scale(1.2)"
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
                                <Tooltip title={!passwordCopied ? t("copy") : t("copied") + " ✔"} placement="top">
                                    <i className="fal fa-copy fa-lg" onClick={this.copyPassword} />
                                </Tooltip>

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