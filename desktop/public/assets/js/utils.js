const path = require("path")

exports.getAppPath = () => {
    switch (process.platform) {
        case 'darwin': {
            return path.join(process.env.HOME, "Library", "Application Support", "OpenPasswordManager")
        }
        case 'win32': {
            return path.join(process.env.APPDATA, "OpenPasswordManager")
        }
        case 'linux': {
            return path.join(process.env.HOME, "OpenPasswordManager")
        }
    }
}

