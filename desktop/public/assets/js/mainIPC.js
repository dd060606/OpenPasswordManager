const ipc = require("electron").ipcMain
const { config, saveConfig, getConfig } = require("./configmanager")

exports.initMainIPC = function () {

    /*
    ipc.on("toMain", (event, args) => {
        console.log(args)
        win.webContents.send("fromMain", "Test2");
    })
    */

    //Themes
    ipc.on("is-saved-theme-valid", (event, args) => {

        event.returnValue = getConfig().theme && (getConfig().theme === 0 || getConfig().theme === 1)
    })
    ipc.on("get-saved-theme", (event, args) => {
        event.returnValue = getConfig().theme
    })
    ipc.on("set-theme", (event, args) => {
        console.log(getConfig().theme = args)
        saveConfig(getConfig())
    })


    //Auth

    ipc.on("get-email", (event, args) => {
        event.returnValue = getConfig().auth.email
    })
    ipc.on("save-email", (event, args) => {
        getConfig().auth.email = args
        saveConfig(getConfig())
    })
    ipc.on("delete-email", (event, args) => {
        getConfig().auth.email = ""
        saveConfig(getConfig())
    })

    //Credentials
    ipc.on("get-credentials-sort-value", (event, args) => {
        event.returnValue = config.credentialsSort
    })
    ipc.on("set-credentials-sort-value", (event, args) => {
        config.credentialsSort = args
        saveConfig(config)
    })
}