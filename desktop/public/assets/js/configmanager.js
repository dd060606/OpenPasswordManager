const path = require("path")
const fs = require("fs")
const logger = require("./logger")

const sysRoot = process.env.APPDATA || (process.platform == "darwin" ? process.env.HOME + "/Library/Application Support" : process.env.HOME)
const dataPath = path.join(sysRoot, "OpenPasswordManager")

exports.getDataDirectory = function () {
    return dataPath
}


const DEFAULT_CONFIG = {
    auth: {
        email: ""
    },
    theme: 0,
    credentialsSort: 2,
    launchAtStartup: true,
    minimizeOnClose: true,
    credentialsSynchronized: true
}
const configPath = path.join(dataPath, 'config.json')

let config = null



exports.saveConfig = function () {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'UTF-8')
}


exports.load = function () {
    let doLoad = true

    if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath, { recursive: true })
    }

    if (!fs.existsSync(configPath)) {
        doLoad = false
        config = DEFAULT_CONFIG
        exports.saveConfig()
    }
    if (doLoad) {
        try {
            config = JSON.parse(fs.readFileSync(configPath, 'UTF-8'))
        } catch (err) {
            logger.error(err)
            logger.log('Configuration file contains malformed JSON or is corrupt.')
            logger.log('Generating a new configuration file.')
            config = DEFAULT_CONFIG
            exports.saveConfig()
        }

    }
    logger.log("Configuration successfully loaded!")
}

exports.isLoaded = function () {
    return config != null
}

exports.getTheme = function () {
    return config.theme ? config.theme : DEFAULT_CONFIG.theme
}

exports.setTheme = function (theme) {
    config.theme = theme
}

exports.getCredentialsSort = function () {
    const availablesSortValues = [0, 1, 2]
    if (availablesSortValues.includes(config.credentialsSort)) {
        return config.credentialsSort
    }
    else {
        return DEFAULT_CONFIG.credentialsSort
    }
}
exports.setCredentialsSort = function (credentialsSort) {
    config.credentialsSort = credentialsSort
}

exports.getEmail = function () {
    return config.auth.email ? config.auth.email : DEFAULT_CONFIG.auth.email
}

exports.setEmail = function (email) {
    config.auth.email = email
}

exports.isLaunchAtStartup = function () {
    return config.launchAtStartup === true || config.launchAtStartup === false ? config.launchAtStartup : DEFAULT_CONFIG.launchAtStartup
}
exports.setLaunchAtStartup = function (launchAtStartup) {
    config.launchAtStartup = launchAtStartup
}

exports.isMinimizeOnClose = function () {
    return config.minimizeOnClose === true || config.minimizeOnClose === false ? config.minimizeOnClose : DEFAULT_CONFIG.minimizeOnClose
}
exports.setMinimizeOnClose = function (minimizeOnClose) {
    config.minimizeOnClose = minimizeOnClose
}



exports.isCredentialsSynchronized = function () {
    return config.credentialsSynchronized === true || config.credentialsSynchronized === false ? config.credentialsSynchronized : DEFAULT_CONFIG.credentialsSynchronized
}

exports.setCredentialsSynchronized = function (isCredentialsSynchronized) {
    config.credentialsSynchronized = isCredentialsSynchronized
}





let token = null
let password = ""
let offlineMode = false

exports.getToken = function () {
    return token
}

exports.setToken = function (accessToken) {
    token = accessToken
}
exports.getPassword = function () {
    return password
}

exports.setPassword = function (newPassword) {
    password = newPassword
}

exports.isOfflineMode = function () {
    if (offlineMode) {
        exports.setCredentialsSynchronized(false)
        exports.saveConfig()
    }
    return offlineMode
}

exports.setOfflineMode = function (isOfflineMode) {
    if (isOfflineMode) {
        exports.setCredentialsSynchronized(false)
        exports.saveConfig()
    }
    offlineMode = isOfflineMode
}

