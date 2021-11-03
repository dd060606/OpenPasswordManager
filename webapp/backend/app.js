const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const fs = require('fs')
const cors = require("cors")
const authRoutes = require("./routes/auth")
const credentialsRoutes = require("./routes/credentials")

const authUtils = require("./utils/database")
const logger = require("./utils/logger")

const app = express()

logger.initLogger()
authUtils.initDatabase()



app.use(cors())
app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')

    next()
});


app.use(express.json())


app.use("/api/auth", authRoutes)
app.use("/api/credentials", credentialsRoutes)


module.exports = app
