const express = require("express")
const router = express.Router()
const credentialsCtrl = require("../controllers/credentials")
const auth = require("../middleware/auth")


router.get("/", auth, credentialsCtrl.getCredentials)
router.post("/add", auth, credentialsCtrl.add)
router.put("/edit/:id", auth, credentialsCtrl.edit)
router.delete("/delete/:id", auth, credentialsCtrl.delete)



module.exports = router