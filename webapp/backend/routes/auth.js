const express = require("express")
const rateLimit = require("express-rate-limit")
const router = express.Router()
const authCtrl = require("../controllers/auth")
const emailRegex = require("../controllers/auth").emailRegex
const emailCtrl = require("../controllers/emails")
const auth = require("../middleware/auth")
const logger = require("../utils/logger")



const registerLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    standardHeaders: false,
    legacyHeaders: false,
    onLimitReached: (req) => logLimitReached(req.ip, "register", req.body.email)
})
const loginLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 15,
    standardHeaders: false,
    legacyHeaders: false,
    onLimitReached: (req) => logLimitReached(req.ip, "login", req.body.email)
})
const emailLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 2,
    standardHeaders: false,
    legacyHeaders: false,
    onLimitReached: (req) => logLimitReached(req.ip, "email", req.body.email)
})

function logLimitReached(ip, type, email) {
    if (!email || !emailRegex.test(email)) {
        email = "invalid email"
    }
    logger.warn(`${ip} has send to many ${type} requests (${email})`)
}

router.post("/signup", registerLimit, authCtrl.signup)
router.post("/login", loginLimit, authCtrl.login)
router.post("/change-password/", auth, authCtrl.changePassword)
router.post("/email/resend", emailLimit, emailCtrl.resendEmail)
router.put("/email/confirmation/", emailCtrl.emailConfirmation)
router.post("/email/validated/", emailCtrl.isEmailConfirmed)
router.get("/info", auth, authCtrl.getInfo)
module.exports = router