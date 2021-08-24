const ConfigManager = require("./configmanager")
const path = require("path")
const fs = require("fs")
const fsPromises = require("fs").promises
const CryptoJS = require("crypto-js")
const logger = require("./logger")

exports.getCredentialsFile = function () {
    return path.join(ConfigManager.getDataDirectory(), "credentials")
}


exports.saveCredentials = function (credentials) {
    const encryptedCredentials = CryptoJS.AES.encrypt(JSON.stringify(credentials), ConfigManager.getPassword()).toString()

    fs.writeFile(exports.getCredentialsFile(), encryptedCredentials, 'UTF-8', function (err) {
        if (err) {
            logger.error(err.message)
            return
        }
        logger.log("Credentials are successfully saved into a file!")
    })



}

exports.loadCredentials = async function () {
    try {
        const data = await fsPromises.readFile(exports.getCredentialsFile(), { encoding: "utf8" })
        const decryptedCredentials = CryptoJS.AES.decrypt(data, ConfigManager.getPassword()).toString(CryptoJS.enc.Utf8)
        return JSON.parse(decryptedCredentials)
    } catch (err) {
        logger.error(err.message)
        return false
    }

}