const express = require("express");
const router = express.Router();

const langsCtrl = require("../controllers/langs");




router.get('/:lang', langsCtrl.getTranslation);

module.exports = router;