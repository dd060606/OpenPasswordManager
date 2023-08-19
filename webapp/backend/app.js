const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/auth")
const credentialsRoutes = require("./routes/credentials")

const authUtils = require("./utils/database")
const logger = require("./utils/logger")

const app = express()
require("dotenv").config()


logger.initLogger()
authUtils.initDatabase()

if (process.env.TRUST_PROXY === "true") {
    app.set("trust proxy", true)
}

app.disable("x-powered-by")
app.use(cors({ origin: JSON.parse(process.env.CORS_DOMAINS) }))

app.use(express.json())


app.use("/api/auth", authRoutes)
app.use("/api/credentials", credentialsRoutes)


module.exports = app
