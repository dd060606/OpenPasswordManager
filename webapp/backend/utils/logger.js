const fs = require("fs")
const logsDir = './logs'
let logNumber = 1


exports.initLogger = () => {
    let date = new Date()
    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours()
        + ":" + date.getMinutes() + ":" + date.getSeconds()
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir)
    }
    fs.readdir(logsDir, (err, files) => {
        while (files.includes(`log_${logNumber}.txt`)) {
            logNumber++
        }
        fs.writeFile(`${logsDir}/log_${logNumber}.txt`, `# Log file ${logNumber} generated : ${time}\n`, function (err) {
            if (err) throw err
        })
    })
}


exports.info = (message) => {

    let date = new Date()
    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours()
        + ":" + date.getMinutes() + ":" + date.getSeconds()

    console.log(`[INFO] (${time}) ${message}`)

    fs.appendFile(`${logsDir}/log_${logNumber}.txt`, `[INFO] (${time}) ${message}\n`, function (err) {
        if (err) throw err
    })
}