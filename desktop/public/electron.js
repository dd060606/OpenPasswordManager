const path = require('path')

const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const electronLocalshortcut = require('electron-localshortcut')

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 729,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js")
        },
        title: "OpenPasswordManager",
        icon: isDev
            ? path.join(__dirname, "/assets/favicon.ico")
            : `file://${path.join(__dirname, "../build/assets/favicon.ico")}`

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