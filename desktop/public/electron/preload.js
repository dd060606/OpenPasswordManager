const {
    contextBridge,
    ipcRenderer
} = require("electron")

contextBridge.exposeInMainWorld(
    "ipc", {
    send: (channel, data) => {
        let validChannels = ["toMain"]
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },
    sendSync: (channel, data) => {
        let validChannels = ["is-saved-theme-valid", "get-saved-theme", "set-theme"]
        if (validChannels.includes(channel)) {
            return ipcRenderer.sendSync(channel, data)
        }
    },
    receive: (channel, func) => {
        let validChannels = ["fromMain"]
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args))
        }
    }
}
)