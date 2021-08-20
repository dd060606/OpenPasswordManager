

const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')
const fs = require("fs")
const isDev = require('electron-is-dev')
const electronLocalshortcut = require('electron-localshortcut')
const ConfigManager = require("./assets/js/configmanager")
const { initMainIPC } = require('./assets/js/mainIPC')

let win
let forceQuit = false


const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on("second-instance", () => {
        if (win) {

            if (win.isMinimized()) {
                win.restore()
            }
            if (!win.isVisible()) {
                win.show()
            }
            win.focus()
        }
    })
}


function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 729,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        },
        title: "OpenPasswordManager",
        icon: path.join(__dirname, "assets", "images", "logo_square.png")
    })

    win.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, '../build/index.html')}`
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
    win.on("closed", () => {
        win = null
    })
    win.on("close", event => {
        if (!forceQuit) {
            event.preventDefault()
            win.hide()
        }

    })



    exports.win = win


}
function initTray() {
    win.tray = new Tray(path.join(__dirname, "assets", "images", "logo_square.png"))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Open", click: () => {
                forceQuit = false
                win.show()
            }
        },
        {
            label: "Quit", click: () => {
                forceQuit = true
                win.close()
            }
        }
    ])
    win.tray.setToolTip("OpenPasswordManager")
    win.tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
    ConfigManager.load()
    initMainIPC()
    createWindow()
    initTray()

})

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


exports.SERVER_URL = "https://apis.dd06-dev.fr/opm"


