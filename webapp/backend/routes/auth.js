const express = require("express")
const router = express.Router()
const authCtrl = require("../controllers/auth")
const auth = require("../middleware/auth");


router.post("/signup", authCtrl.signup)
router.post("/login", authCtrl.login)
router.post("/email/resend", authCtrl.resendEmail)
router.put("/email/confirmation/", authCtrl.emailConfirmation)
router.post("/email/validated/", authCtrl.isEmailConfirmed)
router.get("/info", auth, authCtrl.getInfo)
module.exports = router