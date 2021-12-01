const ipc = require("electron").ipcMain
const ConfigManager = require("./configmanager")
const auth = require("./auth")
const credentials = require("./credentials")
const main = require("../../electron")
const CryptoJS = require("crypto-js")
const { autoUpdater } = require("electron-updater")
const isDev = require("electron-is-dev")
const logger = require("./logger")
const { shell, app } = require("electron")


let isCheckedForUpdates = false
let updateDownloaded = false

exports.initMainIPC = function () {

    //Utils
    ipc.on("openExternalLink", (event, link) => {
        shell.openExternal(link)
    })
    ipc.on("openEmailLink", () => {
        shell.openExternal("https://opm-app.dd06-dev.fr/auth/login")
    })

    ipc.on("getVersion", event => {
        event.returnValue = main.VERSION
    })
    ipc.on("isOfflineMode", event => {
        event.returnValue = ConfigManager.isOfflineMode()
    })

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
        main.openAppOnStartup()
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
    ipc.on("goToOfflineMode", (event, password) => auth.goToOfflineMode(password))

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

    //Updates
    ipc.on("isCheckedForUpdates", event => {
        event.returnValue = isCheckedForUpdates
    })
    ipc.on("checkForUpdates", () => {
        logger.log("Checking for updates...")
        if (isDev) {
            isCheckedForUpdates = true
            logger.log("No updates found!")
            main.win.webContents.send("updateFinished")
            return
        }

        if (process.platform === 'darwin') {
            autoUpdater.autoDownload = false
        }
        autoUpdater.allowPrerelease = true
        autoUpdater.on('update-downloaded', () => {
            isCheckedForUpdates = true
            updateDownloaded = true
            logger.log("Updates finished!")
            main.win.webContents.send("updateFinished")
        })
        autoUpdater.on("update-available", () => {
            if (process.platform === "darwin") {
                logger.log("Updates are available!")
                main.win.webContents.send("updateAvailableMac")
            }
        })
        autoUpdater.on('update-not-available', () => {
            isCheckedForUpdates = true
            logger.log("No updates found!")
            main.win.webContents.send("updateFinished")
        })
        autoUpdater.on('error', (err) => {
            isCheckedForUpdates = true
            logger.error(err)
            main.win.webContents.send("updateError", err)
        })
        autoUpdater.on('download-progress', (progress) => {
            main.win.webContents.send("setUpdateProgress", progress.percent.toFixed(2))
        })
        autoUpdater.checkForUpdates().catch(err => {
            isCheckedForUpdates = true
            logger.error(err)
            main.win.webContents.send("updateError", err)
        })


    })
    ipc.on("openReleasesLink", () => {
        shell.openExternal("https://github.com/dd060606/OpenPasswordManager/releases")
    })


    app.on("before-quit", () => {
        if (updateDownloaded) {
            updateDownloaded = false
            autoUpdater.quitAndInstall()
        }
    })

}

