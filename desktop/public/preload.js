const {
    contextBridge,
    ipcRenderer
} = require("electron")

contextBridge.exposeInMainWorld(
    "ipc", {
    send: (channel, data) => {

        ipcRenderer.send(channel, data)

    },
    sendSync: (channel, data) => {

        return ipcRenderer.sendSync(channel, data)

    },
    receive: (channel, func) => {

        ipcRenderer.on(channel, (event, ...args) => func(...args))

    }
}
)