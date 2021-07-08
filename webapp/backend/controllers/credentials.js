require('dotenv').config()
const db = require("../utils/database").database
const logger = require("../utils/logger")


exports.add = (req, res, next) => {

    if (req.body.name) {
        const insertCredentialsSQL = `INSERT INTO \`${process.env.DB_OPM_CREDENTIALS_TABLE}\` (\`id\`, \`user_id\`, \`name\`, \`url\`, \`username\`, \`password\`) VALUES (NULL, '${req.userId}', '${req.body.name}', '${req.body.url}', '${req.body.username}', '${req.body.password}');`


        db.query(insertCredentialsSQL, function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError())
            }
            logger.info(`${req.headers['x-forwarded-for'] || req.connection.remoteAddress} created new credentials : ${req.body.name} (${req.userId})`)
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
        const updateCredentialsSQL = `UPDATE \`${process.env.DB_OPM_CREDENTIALS_TABLE}\` SET \`name\` = '${req.body.name}', \`url\` = '${req.body.url}', \`username\` = '${req.body.username}', \`password\` = '${req.body.password}' WHERE \`${process.env.DB_OPM_CREDENTIALS_TABLE}\`.\`id\` = ${req.params.id};`

        db.query(updateCredentialsSQL, function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError())
            }
            logger.info(`${req.headers['x-forwarded-for'] || req.connection.remoteAddress} modified credentials : ${req.body.name} (${req.userId})`)

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
        const deleteCredentialSQL = `DELETE FROM \`${process.env.DB_OPM_CREDENTIALS_TABLE}\` WHERE \`${process.env.DB_OPM_CREDENTIALS_TABLE}\`.\`id\` = ${req.params.id}`
        db.query(deleteCredentialSQL, function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError())
            }
            logger.info(`${req.headers['x-forwarded-for'] || req.connection.remoteAddress} deleted credentials : ${req.params.id} (${req.userId})`)

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