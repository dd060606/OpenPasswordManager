

const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require("fs")
const isDev = require('electron-is-dev')
const electronLocalshortcut = require('electron-localshortcut')

const ipc = require("electron").ipcMain

const { getAppPath, configPath, saveDefaultConfig, readConfig, saveConfig, defaultConfig, getDefaultConfig } = require("./utils")

let win
let config = {}


function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 729,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        },
        title: "OpenPasswordManager",
        icon: path.join(__dirname, "../assets/favicon.ico")
    })



    win.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    )
    electronLocalshortcut.register(win, "CommandOrControl+Shift+I", () => {
        if (!win.webContents.isDevToolsOpened()) {
            win.webContents.openDevTools()
        }
        else {
            win.webContents.closeDevTools()
        }
    })

    if (!isDev) {
        win.removeMenu()
    }

    initConfig()

}

function initConfig() {
    fs.mkdir(getAppPath(), { recursive: true }, (err) => {
        if (err) throw err
        fs.access(configPath, (err) => {
            if (err) {
                saveDefaultConfig()
                config = getDefaultConfig()
            } else {
                fs.readFile(configPath, (err, data) => {
                    if (err) throw err
                    config = JSON.parse(data)
                })

            }
        })
    })
}

app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

//IPC

ipc.on("toMain", (event, args) => {
    console.log(args)
    win.webContents.send("fromMain", "Test2");
})


//Themes
ipc.on("is-saved-theme-valid", (event, args) => {

    event.returnValue = config.theme && (config.theme === 0 || config.theme === 1)
})
ipc.on("get-saved-theme", (event, args) => {
    event.returnValue = config.theme
})
ipc.on("set-theme", (event, args) => {
    config.theme = args
    saveConfig(config)
})


//Auth

ipc.on("get-email", (event, args) => {
    event.returnValue = config.auth.email
})
ipc.on("save-email", (event, args) => {
    config.auth.email = args
    saveConfig(config)
})
ipc.on("delete-email", (event, args) => {
    config.auth.email = ""
    saveConfig(config)
})

//Credentials
ipc.on("get-credentials-sort-value", (event, args) => {
    event.returnValue = config.credentialsSort
})
ipc.on("set-credentials-sort-value", (event, args) => {
    config.credentialsSort = args
    saveConfig(config)
})