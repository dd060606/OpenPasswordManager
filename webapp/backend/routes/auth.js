const express = require("express")
const router = express.Router()
const authCtrl = require("../controllers/auth")

router.post("/signup", authCtrl.signup)
router.post("/login", authCtrl.login)
router.post("/email/resend", authCtrl.resendEmail)
router.put("/email/confirmation/", authCtrl.emailConfirmation)
router.post("/email/validated/", authCtrl.isEmailConfirmed)
module.exports = router