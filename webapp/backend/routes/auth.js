const express = require("express")
const router = express.Router()
const authCtrl = require("../controllers/auth")
const emailCtrl = require("../controllers/emails")
const auth = require("../middleware/auth")


router.post("/signup", authCtrl.signup)
router.post("/login", authCtrl.login)
router.post("/email/resend", emailCtrl.resendEmail)
router.put("/email/confirmation/", emailCtrl.emailConfirmation)
router.post("/email/validated/", emailCtrl.isEmailConfirmed)
router.get("/info", auth, authCtrl.getInfo)
module.exports = router