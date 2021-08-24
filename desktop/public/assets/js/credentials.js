const main = require("../../electron")
const ConfigManager = require("./configmanager")
const CryptoJS = require("crypto-js")
const axios = require("axios")
const logger = require("./logger")
const offlineMode = require("./offlinemode")

exports.loadCredentials = async function () {

    if (!ConfigManager.isOfflineMode()) {
        axios.get(`${main.SERVER_URL}/api/credentials/`, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
            .then(async result => {
                for (let i = 0; i < result.data.credentials.length; i++) {
                    result.data.credentials[i].smallImageURL = `https://d2erpoudwvue5y.cloudfront.net/_46x30/${extractRootDomain(result.data.credentials[i].url).replaceAll(".", "_")}@2x.png`
                    result.data.credentials[i].largeImageURL = `https://d2erpoudwvue5y.cloudfront.net/_160x106/${extractRootDomain(result.data.credentials[i].url).replaceAll(".", "_")}@2x.png`

                }
                offlineMode.saveCredentials(result.data.credentials)


                main.win.webContents.send("loadCredentialsResult", { result: "success", credentials: sortCredentials(result.data.credentials) })
            })
            .catch(err => {
                main.win.webContents.send("loadCredentialsResult", { result: "error", credentials: [], error: err.response ? err.response.data : undefined })
            })
    }
    else {
        const credentials = await offlineMode.loadCredentials()
        if (credentials) {
            main.win.webContents.send("loadCredentialsResult", { result: "success", credentials: sortCredentials(credentials) })
        }
        else {
            main.win.webContents.send("loadCredentialsResult", { result: "error", credentials: [], error: "offlineFileError" })
            main.win.webContents.send("goToAuth")
        }
    }


}
exports.addCredentials = function (websiteName, password, username, url) {
    let encryptedPassword = CryptoJS.AES.encrypt(password, ConfigManager.getPassword()).toString()
    axios.post(`${main.SERVER_URL}/api/credentials/add/`, {
        username: username,
        password: encryptedPassword,
        name: websiteName,
        url: url ? url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}` : ""
    }, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
        .then(result => {
            main.win.webContents.send("addCredentialsResult", "success")

        })
        .catch(err => {
            main.win.webContents.send("addCredentialsResult", "error", err.response ? err.response.data : undefined)
        })
}
exports.saveCredentials = function (id, websiteName, password, username, url) {

    let encryptedPassword = CryptoJS.AES.encrypt(password, ConfigManager.getPassword()).toString()
    axios.put(`${main.SERVER_URL}/api/credentials/edit/${id}`, {
        username: username,
        password: encryptedPassword,
        name: websiteName,
        url: url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`
    }, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
        .then(() => {
            main.win.webContents.send("saveCredentialsResult", { result: "success" })

        })
        .catch(err => {
            main.win.webContents.send("saveCredentialsResult", { result: "error", error: err.response ? err.response.data : undefined })

        })
}
exports.deleteCredentials = function (id) {
    axios.delete(`${main.SERVER_URL}/api/credentials/delete/${id}`, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
        .then(() => {
            main.win.webContents.send("deleteCredentialsResult", { result: "success" })

        })
        .catch(err => {
            main.win.webContents.send("deleteCredentialsResult", { result: "error", error: err.response ? err.response.data : undefined })
        })
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
