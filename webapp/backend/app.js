const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")


const authRoutes = require("./routes/auth")
const authUtils = require("./utils/auth-utils")

const app = express()

authUtils.initDatabase()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
});

app.use(express.json())

app.use("/api/auth", authRoutes)

module.exports = app
