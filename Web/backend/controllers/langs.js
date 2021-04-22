const fs = require("fs")
const allLangs = ["en", "fr"]
exports.getTranslation = (req, res, next) => {
    fs.readFile(`langs/${req.params.lang}.json`, (err, data) => {
        if (err) {
            if (!allLangs.includes(req.params.lang)) {
                res.status(404).json({ type: "error-lang-not-found" })
            }
            else {
                res.status(500).json({ type: "internal-server-error" })
            }
        }
        let result = JSON.parse(data);

        res.status(200).json({ type: "succes", result: result })
    });

};

