const path = require("path")
const fs = require("fs")
const { getAppPath } = require("./utils")
const logger = require("./logger")


const defaultConfig = {
    auth: {
        email: "",
        hash: ""
    },
    syncCredentials: true,
    theme: 0,
    credentialsSort: 2
}
let config = {}



exports.getDefaultConfig = () => { return defaultConfig }
exports.getConfig = () => { return config }
exports.setConfig = (newConfig) => { config = newConfig }

exports.initConfig = () => {
    logger.info("Initializing configuration...")
    fs.mkdir(getAppPath(), { recursive: true }, (err) => {
        try {
            if (err) throw err
            fs.access(exports.configPath, (err) => {
                if (err) {
                    saveDefaultConfig()
                    config = getDefaultConfig()
                    logger.info("Configuration file successfully created!")

                } else {
                    fs.readFile(exports.configPath, (err, data) => {
                        if (err) throw err
                        config = JSON.parse(data)
                        logger.info("Configuration successfully loaded!")
                    })

                }
            })
        } catch (err) {
            logger.error(err)
        }

    })
}





exports.configPath = path.join(getAppPath(), "\\", "config.json")

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
