const main = require("../../electron")
const ConfigManager = require("./configmanager")
const CryptoJS = require("crypto-js")
const axios = require("axios")
const logger = require("./logger")
const offlineMode = require("./offlinemode")
const fs = require("fs")

exports.loadCredentials = async function () {
    logger.log("Loading credentials...")
    try {
        if (ConfigManager.isOfflineMode()) {
            const res = await axios.head(`${main.SERVER_URL.substring(0, main.SERVER_URL.length - 4)}`)
            if (res && res.status === 200) {
                ConfigManager.setOfflineMode(false)
            }
        }
    } catch (err) {
        ConfigManager.setOfflineMode(true)
        logger.error("Error: Cannot reach the server: " + err.message)
        logger.log("Offline mode is enabled")
    }
    finally {
        if (!ConfigManager.isOfflineMode()) {
            if (!ConfigManager.isCredentialsSynchronized()) {
                loadOfflineCredentials()
                return
            }
            axios.get(`${main.SERVER_URL}/api/credentials/`, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
                .then(async result => {
                    for (let i = 0; i < result.data.credentials.length; i++) {
                        result.data.credentials[i].smallImageURL = `https://d2erpoudwvue5y.cloudfront.net/_46x30/${extractRootDomain(result.data.credentials[i].url).replaceAll(".", "_")}@2x.png`
                        result.data.credentials[i].largeImageURL = `https://d2erpoudwvue5y.cloudfront.net/_160x106/${extractRootDomain(result.data.credentials[i].url).replaceAll(".", "_")}@2x.png`
                    }
                    offlineMode.saveCredentials(result.data.credentials)
                    logger.log("Credentials loaded")
                    main.win.webContents.send("loadCredentialsResult", { result: "success", credentials: sortCredentials(result.data.credentials) })

                })
                .catch(err => {
                    logger.error("Error while loading credentials: " + err.message)
                    main.win.webContents.send("loadCredentialsResult", { result: "error", credentials: [], error: err.response ? err.response.data : undefined })
                    main.win.webContents.send("goToAuth")

                })
        }
        else {

            const credentials = await offlineMode.loadCredentials()
            if (credentials) {
                logger.log("Offline credentials loaded")
                main.win.webContents.send("loadCredentialsResult", { result: "success", credentials: sortCredentials(credentials) })
            }
            else {
                fs.writeFileSync(offlineMode.getCredentialsFile(), CryptoJS.AES.encrypt("[]", ConfigManager.getPassword()).toString(), 'UTF-8', function (err) {
                    if (err) {
                        logger.error("Error while creating offline credentials file: " + err.message)
                        return
                    }
                })
                logger.error("Error : Cannot load offline credentials file")
                main.win.webContents.send("loadCredentialsResult", { result: "error", credentials: [], error: "offline-file-error" })
            }
        }
    }




}
function loadOfflineCredentials() {
    axios.get(`${main.SERVER_URL}/api/credentials/`, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
        .then(async result => {
            try {
                const credentials = await offlineMode.loadCredentials()
                logger.log("Synchronizing offline credentials...")
                if (credentials) {
                    let remoteIdList = []

                    for (let i = 0; i < result.data.credentials.length; i++) {
                        remoteIdList.push(result.data.credentials[i].id)
                        for (let j = 0; j < credentials.length; j++) {
                            if (result.data.credentials[i].id === credentials[j].id) {
                                await axios.put(`${main.SERVER_URL}/api/credentials/edit/${result.data.credentials[i].id}`, {
                                    username: credentials[j].username,
                                    password: credentials[j].password,
                                    name: credentials[j].name,
                                    url: credentials[j].url.startsWith("http://") || credentials[j].url.startsWith("https://") ? credentials[j].url : `https://${credentials[j].url}`
                                }, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
                            }
                        }
                    }

                    for (let i = 0; i < credentials.length; i++) {
                        if (!remoteIdList.includes(credentials[i].id)) {
                            await axios.post(`${main.SERVER_URL}/api/credentials/add/`, {
                                username: credentials[i].username,
                                password: credentials[i].password,
                                name: credentials[i].name,
                                url: credentials[i].url ? credentials[i].url.startsWith("http://") || credentials[i].url.startsWith("https://") ? credentials[i].url : `https://${credentials[i].url}` : ""
                            }, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })

                        }
                    }


                }

            }
            catch (err) {
                logger.error("Error while synchronizing offline credentials: " + err.message)
                return
            }
            ConfigManager.setCredentialsSynchronized(true)
            ConfigManager.saveConfig()
            exports.loadCredentials()



        }).catch(err => {
            logger.error("Error while loading credentials: " + err.message)
            main.win.webContents.send("loadCredentialsResult", { result: "error", credentials: [], error: err.response ? err.response.data : undefined })
        })

}
exports.addCredentials = async function (websiteName, password, username, url) {
    const encryptedPassword = CryptoJS.AES.encrypt(password, ConfigManager.getPassword()).toString()

    if (!ConfigManager.isOfflineMode()) {
        axios.post(`${main.SERVER_URL}/api/credentials/add/`, {
            username: username,
            password: encryptedPassword,
            name: websiteName,
            url: url ? url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}` : ""
        }, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
            .then(() => {
                logger.log(`Credential created : ${websiteName} - (${username})`)
                main.win.webContents.send("addCredentialsResult", "success")
            })
            .catch(err => {
                logger.error("Error while creating credential: " + err.message)
                main.win.webContents.send("addCredentialsResult", "error", err.response ? err.response.data : undefined)
            })
    } else {
        const credentials = await offlineMode.loadCredentials()
        if (credentials) {
            let tempId = 1
            let idList = []
            for (let i = 0; i < credentials.length; i++) {
                idList.push(credentials[i].id)
            }
            while (idList.includes(tempId)) {
                tempId++
            }
            credentials.push({
                id: tempId, username: username, password: encryptedPassword, name: websiteName, url: url ? url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}` : "",
                smallImageURL: `https://d2erpoudwvue5y.cloudfront.net/_46x30/${extractRootDomain(url).replaceAll(".", "_")}@2x.png`,
                largeImageURL: `https://d2erpoudwvue5y.cloudfront.net/_160x106/${extractRootDomain(url).replaceAll(".", "_")}@2x.png`
            })
            logger.log(`Offline credential created : ${websiteName} - '${username})`)
            main.win.webContents.send("addCredentialsResult", "success")
            offlineMode.saveCredentials(credentials)
        }
        else {
            fs.writeFileSync(offlineMode.getCredentialsFile(), CryptoJS.AES.encrypt("[]", ConfigManager.getPassword()).toString(), 'UTF-8', function (err) {
                if (err) {
                    logger.error("Error while creating offline credentials file: " + err.message)
                    return
                }
            })
            logger.error("Error: Cannot load offline credentials file")
            main.win.webContents.send("loadCredentialsResult", { result: "error", credentials: [], error: "offlineFileError" })
        }
    }
}
exports.saveCredentials = async function (id, websiteName, password, username, url) {

    let encryptedPassword = CryptoJS.AES.encrypt(password, ConfigManager.getPassword()).toString()
    if (!ConfigManager.isOfflineMode()) {

        axios.put(`${main.SERVER_URL}/api/credentials/edit/${id}`, {
            username: username,
            password: encryptedPassword,
            name: websiteName,
            url: url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`
        }, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
            .then(() => {
                logger.log(`Credential edited : (${id}) - ${websiteName} - (${username})`)
                main.win.webContents.send("saveCredentialsResult", { result: "success" })

            })
            .catch(err => {
                logger.error("Error while editing credential: " + err.message)
                main.win.webContents.send("saveCredentialsResult", { result: "error", error: err.response ? err.response.data : undefined })

            })
    }
    else {
        const credentials = await offlineMode.loadCredentials()
        if (credentials) {
            for (let i = 0; i < credentials.length; i++) {
                if (credentials[i].id) {
                    if (credentials[i].id === id) {
                        credentials[i].name = websiteName
                        credentials[i].password = encryptedPassword
                        credentials[i].username = username
                        credentials[i].url = url
                        offlineMode.saveCredentials(credentials)
                        break
                    }
                }

            }
            logger.log(`Offline credential edited : (${id}) - ${websiteName} - (${username})`)
            main.win.webContents.send("saveCredentialsResult", { result: "success" })
        }
        else {
            fs.writeFileSync(offlineMode.getCredentialsFile(), CryptoJS.AES.encrypt("[]", ConfigManager.getPassword()).toString(), 'UTF-8', function (err) {
                if (err) {
                    logger.error("Error while creating offline credentials file: " + err.message)
                    return
                }
            })
            logger.error("Error: Cannot load offline credentials file")
            main.win.webContents.send("loadCredentialsResult", { result: "error", credentials: [], error: "offlineFileError" })
        }
    }
}
exports.deleteCredentials = async function (id) {
    if (!ConfigManager.isOfflineMode()) {

        axios.delete(`${main.SERVER_URL}/api/credentials/delete/${id}`, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
            .then(() => {
                logger.log(`Credential deleted : (${id})`)
                main.win.webContents.send("deleteCredentialsResult", { result: "success" })

            })
            .catch(err => {
                logger.error("Error while deleting credential: " + err.message)
                main.win.webContents.send("deleteCredentialsResult", { result: "error", error: err.response ? err.response.data : undefined })
            })
    }
    else {
        const credentials = await offlineMode.loadCredentials()
        if (credentials) {
            for (let i = 0; i < credentials.length; i++) {
                if (credentials[i].id) {
                    if (credentials[i].id === id) {
                        credentials.splice(i, 1)
                        offlineMode.saveCredentials(credentials)
                        break
                    }
                }
            }
            logger.log(`Offline credential deleted : (${id})`)
            main.win.webContents.send("deleteCredentialsResult", { result: "success" })
        }
        else {
            fs.writeFileSync(offlineMode.getCredentialsFile(), CryptoJS.AES.encrypt("[]", ConfigManager.getPassword()).toString(), 'UTF-8', function (err) {
                if (err) {
                    logger.error("Error while creating offline credentials file: " + err.message)
                    return
                }
            })
            logger.error("Error: Cannot load offline credentials file")
            main.win.webContents.send("loadCredentialsResult", { result: "error", credentials: [], error: "offlineFileError" })
        }
    }
}
function sortCredentials(credentialsArray) {
    if (ConfigManager.getCredentialsSort() === 0) {
        return credentialsArray.sort((a, b) => (a.name || "").toString().localeCompare((b.name || "").toString()))

    }
    else if (ConfigManager.getCredentialsSort() === 1) {
        return (credentialsArray.sort((a, b) => (a.name || "").toString().localeCompare((b.name || "").toString()))).sort().reverse()

    }
    else {
        return credentialsArray.sort((a, b) => b.id - a.id)
    }
}
function extractHostname(url) {
    var hostname;

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2]
    }
    else {
        hostname = url.split('/')[0]
    }

    hostname = hostname.split(':')[0]
    hostname = hostname.split('?')[0]

    return hostname
}

function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1]
        if (splitArr[arrLen - 2].length === 2 && splitArr[arrLen - 1].length === 2) {
            domain = splitArr[arrLen - 3] + '.' + domain
        }
    }
    return domain
}

