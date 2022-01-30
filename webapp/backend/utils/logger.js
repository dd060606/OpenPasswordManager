const fs = require("fs")
const logsDir = "./logs"
const latestLogPath = `${logsDir}/latest.log`




exports.initLogger = () => {
    let date = new Date()
    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours()
        + ":" + date.getMinutes() + ":" + date.getSeconds()
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir)
    }
    if (!fs.existsSync(latestLogPath)) {
        fs.writeFileSync(latestLogPath, `# Log file generated : ${time}\n`)
    }

}


exports.info = (message) => {

    let date = new Date()
    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours()
        + ":" + date.getMinutes() + ":" + date.getSeconds()
    console.log(`[INFO] (${time}) ${message}`)
    fs.appendFile(latestLogPath, `[INFO] (${time}) ${message}\n`, function (err) {
        if (err) throw err
    })
}
exports.error = (message) => {
    let date = new Date()
    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours()
        + ":" + date.getMinutes() + ":" + date.getSeconds()
    console.error(`[ERROR] (${time}) ${message}`)
    fs.appendFile(latestLogPath, `[ERROR] (${time}) ${message}\n`, function (err) {
        if (err) throw err
    })
}
exports.warn = (message) => {
    let date = new Date()
    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours()
        + ":" + date.getMinutes() + ":" + date.getSeconds()
    console.error(`[WARN] (${time}) ${message}`)
    fs.appendFile(latestLogPath, `[WARN] (${time}) ${message}\n`, function (err) {
        if (err) throw err
    })
}