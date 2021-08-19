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
    credentialsSort: 2
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
    return config.theme
}

exports.setTheme = function (theme) {
    config.theme = theme
}

exports.getCredentialsSort = function () {
    return config.credentialsSort
}

exports.setCredentialsSort = function (credentialsSort) {
    config.credentialsSort = credentialsSort
}
exports.getEmail = function () {
    return config.auth.email
}

exports.setEmail = function (email) {
    config.auth.email = email
}

let token = null
let password = ""
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