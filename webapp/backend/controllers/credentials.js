require('dotenv').config()
const db = require("../utils/database").database
const logger = require("../utils/logger")
const CryptoJS = require("crypto-js")

const PASSWORD_KEY = process.env.PASSWORD_ENCRYPT_KEY

exports.add = (req, res, next) => {

    if (req.body.name) {
        const insertCredentialsSQL = `INSERT INTO \`${process.env.DB_OPM_CREDENTIALS_TABLE}\` (\`id\`, \`user_id\`, \`name\`, \`url\`, \`username\`, \`password\`) VALUES (NULL, ?, ?, ?, ?, ?);`


        db.query(insertCredentialsSQL, [req.userId, req.body.name, req.body.url, req.body.username, CryptoJS.AES.encrypt(req.body.password, PASSWORD_KEY).toString()], function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError(err.message))
            }
            logger.info(`${req.ip} created new credentials : ${req.body.name} (${req.userId})`)
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
exports.edit = (req, res, next) => {

    if (req.body.name && req.params.id) {
        const updateCredentialsSQL = `UPDATE \`${process.env.DB_OPM_CREDENTIALS_TABLE}\` SET \`name\` = ?, \`url\` = ?, \`username\` = ?, \`password\` = ? WHERE \`${process.env.DB_OPM_CREDENTIALS_TABLE}\`.\`id\` = ? AND \`${process.env.DB_OPM_CREDENTIALS_TABLE}\`.\`user_id\` = ?;`

        db.query(updateCredentialsSQL, [req.body.name, req.body.url, req.body.username, CryptoJS.AES.encrypt(req.body.password, PASSWORD_KEY).toString(), req.params.id, req.userId], function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError(err.message))
            }
            if (result.affectedRows === 0) {
                return res.status(401).json(getJsonForUnauthorized(`${req.ip} tried to edit credentials : ${req.params.id} (${req.userId})`))
            }
            logger.info(`${req.ip} modified credentials : ${req.body.name} (${req.userId})`)

            return res.status(200).json({
                result: "success",
                type: "credentials-successfully-modified",
                message: "Credentials successfully modified!",

            })
        })
    }
    else {
        return res.status(400).json(getJsonForArgumentsError())
    }

}
exports.delete = (req, res, next) => {
    if (req.params.id) {
        const deleteCredentialSQL = `DELETE FROM \`${process.env.DB_OPM_CREDENTIALS_TABLE}\` WHERE \`${process.env.DB_OPM_CREDENTIALS_TABLE}\`.\`id\` = ? AND \`${process.env.DB_OPM_CREDENTIALS_TABLE}\`.\`user_id\` = ?;`
        db.query(deleteCredentialSQL, [req.params.id, req.userId], function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError(err.message))
            }
            if (result.affectedRows === 0) {
                return res.status(401).json(getJsonForUnauthorized(`${req.ip} tried to remove credentials : ${req.params.id} (${req.userId})`))
            }
            logger.info(`${req.ip} deleted credentials : ${req.params.id} (${req.userId})`)

            return res.status(200).json({
                result: "success",
                type: "credentials-successfully-deleted",
                message: "Credentials successfully deleted!",

            })
        })
    }
    else {
        return res.status(400).json(getJsonForArgumentsError())
    }
}
exports.getCredentials = (req, res, next) => {

    db.query(`SELECT * FROM \`${process.env.DB_OPM_CREDENTIALS_TABLE}\` WHERE user_id = ?`, [req.userId], function (err, result) {
        if (err) {
            return res.status(500).json(getJsonForInternalError(err.message))
        }
        let finalCreds = exports.serverSideDecrypt(result);

        return res.status(200).json({
            result: "success",
            credentials: finalCreds
        })
    })
}

exports.serverSideDecrypt = (credentials) => {
    credentials.forEach(creds => {
        try {
            creds["password"] = CryptoJS.AES.decrypt(creds.password, process.env.PASSWORD_ENCRYPT_KEY).toString(CryptoJS.enc.Utf8)
        }
        catch (err) {
            creds["password"] = ""
        }
    })
    return credentials
}

function getJsonForArgumentsError() {
    return ({
        result: "error",
        type: "bad-request-args",
        message: "Error : Bad request arguments!"
    })
}
function getJsonForInternalError(message) {
    logger.error(message)
    return ({
        result: "error",
        type: "internal-error",
        message: "Error : Internal server error!"
    })
}
function getJsonForUnauthorized(message) {
    logger.warn(message)
    return ({
        result: "error",
        type: "unauthorized-error",
        message: "Error : Access unauthorized!"
    })
}