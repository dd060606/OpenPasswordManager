require('dotenv').config()
const db = require("../utils/database").database


exports.add = (req, res, next) => {

    if (req.body.name && req.body.url && req.body.username && req.body.password) {
        const insertCredentialsSQL = "INSERT INTO `" + process.env.DB_OPM_CREDENTIALS_TABLE + "` (`id`, `user_id`, `name`, `url`, `username`, `password`) VALUES (NULL, '"
            + req.userId
            + "', '" + req.body.name
            + "', '" + req.body.url
            + "', '" + req.body.username
            + "', '" + req.body.password
            + "');"

        db.query(insertCredentialsSQL, function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError())
            }
            return res.status(201).json({
                result: "success",
                type: "credentials-successfully-created",
                message: "Credentials successfully created!",

            })
        })
    }
    else {
        return res.status(400).json(getJsonForArgumentsError())
    }
}
exports.getCredentials = (req, res, next) => {
    db.query(`SELECT * FROM \`${process.env.DB_OPM_CREDENTIALS_TABLE}\` WHERE user_id = ${req.userId}`, function (err, result) {
        if (err) {
            return res.status(500).json(getJsonForInternalError())
        }
        return res.status(200).json({
            result: "success",
            credentials: result

        })
    })
}

function getJsonForArgumentsError() {
    return ({
        result: "error",
        type: "bad-request-args",
        message: "Error : Bad request arguments!"
    })
}
function getJsonForInternalError() {
    return ({
        result: "error",
        type: "internal-error",
        message: "Error : Internal server error!"
    })
}