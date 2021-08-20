const ipc = require("electron").ipcMain
const ConfigManager = require("./configmanager")
const auth = require("./auth")
const credentials = require("./credentials")
const main = require("../../electron")
const CryptoJS = require("crypto-js")
const logger = require("./logger")



exports.initMainIPC = function () {
    //Themes
    ipc.on("isSavedThemeValid", (event) => {
        event.returnValue = ConfigManager.getTheme() && (ConfigManager.getTheme() === 0 || ConfigManager.getTheme() === 1)
    })
    ipc.on("getSavedTheme", (event) => {
        event.returnValue = ConfigManager.getTheme()
    })
    ipc.on("setTheme", (event, theme) => {
        ConfigManager.setTheme(theme)
        ConfigManager.saveConfig()
    })

    //Settings
    ipc.on("isLaunchAtStartup", event => {
        event.returnValue = ConfigManager.isLaunchAtStartup()
    })
    ipc.on("setLaunchAtStartup", (event, launchAtStartup) => {
        ConfigManager.setLaunchAtStartup(launchAtStartup)
        ConfigManager.saveConfig()



        exports.autoLauncher.isEnabled()
            .then((isEnabled) => {
                if (launchAtStartup && !isEnabled) {
                    exports.autoLauncher.enable()
                }
                else if (!launchAtStartup && isEnabled) {
                    exports.autoLauncher.disable()
                }

            })
            .catch(function (err) {
                logger.error(err)
            })
    })
    ipc.on("isMinimizeOnClose", event => {
        event.returnValue = ConfigManager.isMinimizeOnClose()
    })
    ipc.on("setMinimizeOnClose", (event, minimizeOnClose) => {
        ConfigManager.setMinimizeOnClose(minimizeOnClose)
        ConfigManager.saveConfig()
    })

    //Auth
    ipc.on("getEmail", (event) => {
        event.returnValue = ConfigManager.getEmail()
    })
    ipc.on("saveEmail", (event, email) => {
        ConfigManager.setEmail(email)
        ConfigManager.saveConfig()
    })
    ipc.on("signup", (event, account) => auth.signup(account.lastname, account.firstname, account.email, account.password, account.lang))
    ipc.on("checkEmailConfirmation", (event, account) => auth.checkEmailConfirmation(account.email, account.password))
    ipc.on("resendEmail", (event, args) => {
        axios.post(`${main.SERVER_URL}/api/auth/email/resend`,
            {
                email: args.email,
                lang: args.lang
            }
        )
    })
    ipc.on("login", (event, account) => auth.login(account.email, account.password))

    ipc.on("checkAuthentication", () => auth.checkAuthentication())
    ipc.on("changePassword", (event, passwords) => auth.changePassword(passwords.currentPassword, passwords.newPassword))
    ipc.on("confirmPassword", (event, password) => auth.confirmPassword(password))
    ipc.on("isPasswordSaved", event => { event.returnValue = ConfigManager.getPassword() ? true : false })
    ipc.on("getAccountInfo", () => auth.getAccountInfo())

    //Credentials
    ipc.on("getCredentialsSort", (event) => {
        event.returnValue = ConfigManager.getCredentialsSort()
    })
    ipc.on("setCredentialsSort", (event, credentialsSort) => {
        ConfigManager.setCredentialsSort(credentialsSort)
        ConfigManager.saveConfig()
    })
    ipc.on("loadCredentials", () => credentials.loadCredentials())
    ipc.on("addCredentials", (event, credential) => credentials.addCredentials(credential.websiteName, credential.password, credential.username, credential.url))
    ipc.on("saveCredentials", (event, credential) => credentials.saveCredentials(credential.id, credential.websiteName, credential.password, credential.username, credential.url))
    ipc.on("deleteCredentials", (event, id) => credentials.deleteCredentials(id))
    ipc.on("decryptCredentialsPassword", (event, passwordToDecrypt) => {
        event.returnValue = CryptoJS.AES.decrypt(passwordToDecrypt, ConfigManager.getPassword()).toString(CryptoJS.enc.Utf8)
    })
}