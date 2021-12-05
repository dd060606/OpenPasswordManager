const configmanager = require('./configmanager')
const fs = require('fs')
const path = require('path')
let initialized = false
let currentLogFilePath = ""

exports.log = function (message) {
    console.log("[INFO] : " + message)
    if (initialized) {
        fs.appendFile(currentLogFilePath, `[INFO] ${message}\n`, function (err) {
            if (err) throw err
        })
    }
}
exports.error = function (message) {
    console.error("[ERROR] : " + message)
    if (initialized) {
        fs.appendFile(currentLogFilePath, `[ERROR] ${message}\n`, function (err) {
            if (err) throw err
        })
    }
}
exports.init = function () {
    let logsDir = path.join(configmanager.getDataDirectory(), "Logs")
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true })
    }
    let date = new Date()
    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + "-" + date.getHours()
        + "-" + date.getMinutes()
    currentLogFilePath = path.join(logsDir, `${time}.txt`)
    fs.writeFileSync(currentLogFilePath, `#Log file ${time}\n`, 'UTF-8')
    initialized = true
}