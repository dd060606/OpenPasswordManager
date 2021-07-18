const path = require("path")
const fs = require("fs")

const defaultConfig = {
    auth: {
        email: "",
        hash: ""
    },
    syncCredentials: true,
    theme: 0,
    credentialsSort: 2
}

exports.getDefaultConfig = () => { return defaultConfig }
exports.getAppPath = () => {
    switch (process.platform) {
        case 'darwin': {
            return path.join(process.env.HOME, "Library", "Application Support", "OpenPasswordManager")
        }
        case 'win32': {
            return path.join(process.env.APPDATA, "OpenPasswordManager")
        }
        case 'linux': {
            return path.join(process.env.HOME, "OpenPasswordManager")
        }
    }
}

exports.configPath = path.join(this.getAppPath(), "\\", "config.json")

exports.saveDefaultConfig = () => {
    fs.writeFile(this.configPath, JSON.stringify(defaultConfig, null, 2), err => {
        if (err) throw err
    })
}
exports.saveConfig = newConfig => {
    fs.writeFile(this.configPath, JSON.stringify(newConfig, null, 2), err => {
        if (err) throw err
    })
}
