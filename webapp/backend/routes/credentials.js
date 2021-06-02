const express = require("express")
const router = express.Router()
const credentialsCtrl = require("../controllers/credentials")
const auth = require("../middleware/auth")


router.get("/", auth, credentialsCtrl.getCredentials)
router.post("/add", auth, credentialsCtrl.add)

module.exports = router