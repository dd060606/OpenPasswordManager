
const http = require("http")
const app = require("./app")
const logger = require("./utils/logger")
require("dotenv").config()



const normalizePort = val => {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false
}
const port = normalizePort(process.env.PORT)
app.set("port", port)

const errorHandler = error => {
    if (error.syscall !== "listen") {
        throw error
    }
    const address = server.address()
    const bind = typeof address === "string" ? "pipe " + address : "port: " + port
    switch (error.code) {
        case "EACCES":
            logger.error(bind + " requires elevated privileges.")
            process.exit(1)

        case "EADDRINUSE":
            logger.error(bind + " is already in use.")
            process.exit(1)

        default:
            throw error
    }
}
logger.info("Starting server...")
const server = http.createServer(app)

//Check if .env is valid
if (!process.env.AUTH_TOKEN_KEY || !process.env.PASSWORD_ENCRYPT_KEY) {
    logger.error("Please provide a valid key for password encryption and token signature in .env !")
    process.exit(1)
}


server.on("error", errorHandler)
server.on("listening", () => {
    const address = server.address()
    const bind = typeof address === "string" ? "pipe " + address : "port " + port
    logger.info("Listening on " + bind)
});

server.listen(port)
