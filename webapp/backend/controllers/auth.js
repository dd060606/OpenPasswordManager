const bcyrpt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../utils/database").database
const logger = require("../utils/logger")
const fs = require("fs")
const sendEmail = require("../controllers/emails").sendEmail
const CryptoJS = require("crypto-js")

require('dotenv').config()



const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&_]{8,}$/
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


exports.signup = (req, res, next) => {

    if (validateSignup(req)) {

        db.query(`SELECT id FROM ${process.env.DB_OPM_ACCOUNTS_TABLE} WHERE email = ?`, [req.body.email], function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError(err.message))
            }
            if (result.length === 0) {
                return signupAccount(req, res)
            }
            else {
                return res.status(400).json({
                    result: "error",
                    type: "email-already-exists",
                    message: "Error : e-mail already exists!"
                })
            }
        })
    }
    else {
        return res.status(400).json(getJsonForArgumentsError())
    }



}

function signupAccount(req, res) {


    bcyrpt.hash(req.body.password, 10)
        .then(hash => {

            const insertAccountSQL = `INSERT INTO \`${process.env.DB_OPM_ACCOUNTS_TABLE}\` (\`id\`, \`email\`, \`password\`, \`lastname\`, \`firstname\`, \`isVerified\`)`
                + `VALUES (NULL, ?, ?, ?, ?, '0');`



            db.query(insertAccountSQL, [req.body.email, hash, req.body.lastname, req.body.firstname], function (err, result) {
                if (err) {
                    return res.status(500).json(getJsonForInternalError(err.message))
                }

                if (req.body.lang) {
                    fs.exists(`emails/${req.body.lang}/account-confirmation-template.html`, function (exists) {
                        if (exists) {
                            sendEmail(req.body.lang, req)
                        }
                        else {
                            sendEmail("en", req)

                        }
                    });
                }
                else {
                    sendEmail("en", req)
                }


                logger.info(`New account created : ${req.body.email} - ${req.body.lastname} ${req.body.firstname} from ${(req.headers['x-real-ip'] || req.connection.remoteAddress)}`)
                return res.status(201).json({
                    result: "success",
                    type: "account-successfully-created",
                    message: "Account successfully created!",

                })
            })
        })
        .catch(error => res.status(500).json(getJsonForInternalError(error.message)))


}
exports.login = (req, res, next) => {

    if (validateLogin(req)) {

        db.query(`SELECT * FROM \`${process.env.DB_OPM_ACCOUNTS_TABLE}\` WHERE email = ?`, [req.body.email], function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError(err.message))
            }
            if (result.length === 0) {
                return res.status(401).json({
                    result: "error",
                    type: "invalid-credentials",
                    message: "Invalid credentials!"
                })
            }
            else {
                bcyrpt.compare(req.body.password, result[0].password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({
                                result: "error",
                                type: "invalid-credentials",
                                message: "Invalid credentials!"
                            })

                        }
                        logger.info(`${req.headers['x-real-ip'] || req.connection.remoteAddress} logged to ${req.body.email} (${result[0].id})`)

                        if (result[0].isVerified === 1) {
                            return res.status(200).json({
                                result: "success",
                                token: jwt.sign({ userId: result[0].id },
                                    process.env.AUTH_TOKEN_KEY, { expiresIn: "1h" }
                                )
                            })
                        }
                        else {

                            return res.status(401).json({
                                result: "error",
                                type: "email-not-verified",
                                message: "Email not verified!"
                            })

                        }


                    })
                    .catch(err => res.status(500).json(getJsonForInternalError(err.message)))
            }

        })
    }
    else {
        return res.status(400).json(getJsonForArgumentsError())
    }

}

exports.changePassword = (req, res, next) => {
    if (validateChangePassword(req)) {

        db.query(`SELECT password FROM \`${process.env.DB_OPM_ACCOUNTS_TABLE}\` WHERE id = ?`, [req.userId], function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError(err.message))
            }

            bcyrpt.compare(req.body.currentPassword, result[0].password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            result: "error",
                            type: "wrong-password",
                            message: "Wrong password!"
                        })
                    }
                    bcyrpt.hash(req.body.newPassword, 10)
                        .then(hash => {
                            const changePasswordSQL = `UPDATE \`${process.env.DB_OPM_ACCOUNTS_TABLE}\` SET \`password\` = ? WHERE \`${process.env.DB_OPM_ACCOUNTS_TABLE}\`.\`id\` = ?;`

                            db.query(changePasswordSQL, [hash, req.userId], function (err2) {
                                if (err2) {
                                    return res.status(500).json(getJsonForInternalError(err2.message))
                                }
                                db.query(`SELECT * FROM \`${process.env.DB_OPM_CREDENTIALS_TABLE}\` WHERE user_id = ?`, [req.userId], function (err3, result2) {
                                    if (err3) {
                                        return res.status(500).json(getJsonForInternalError(err3.message))
                                    }

                                    for (let i = 0; i < result2.length; i++) {
                                        const decryptedPassword = CryptoJS.AES.decrypt(result2[i].password, req.body.currentPassword).toString(CryptoJS.enc.Utf8)
                                        const encryptedPassword = CryptoJS.AES.encrypt(decryptedPassword, req.body.newPassword).toString()
                                        db.query(`UPDATE \`${process.env.DB_OPM_CREDENTIALS_TABLE}\` SET \`password\` = ? WHERE \`${process.env.DB_OPM_CREDENTIALS_TABLE}\`.\`id\` = ?;`, [encryptedPassword, result2[i].id], function (err4) {
                                            if (err4) {
                                                return res.status(500).json(getJsonForInternalError(err4.message))
                                            }
                                        })
                                    }
                                    logger.info(`Password modified : (${req.userId}) from ${req.headers["x-real-ip"] || req.connection.remoteAddress}`)
                                    return res.status(201).json({
                                        result: "success",
                                        type: "password-successfully-modified",
                                        message: "Password successfully modified!",

                                    })
                                })

                            })
                        })
                        .catch(error => res.status(500).json(getJsonForInternalError(error.message)))
                })
                .catch(err => res.status(500).json(getJsonForInternalError(err.message)))
        })


    }
    else {
        return res.status(400).json(getJsonForArgumentsError())
    }
}


exports.getInfo = (req, res, next) => {
    db.query(`SELECT * FROM \`${process.env.DB_OPM_ACCOUNTS_TABLE}\` WHERE id = ?`, [req.userId], function (err, result) {

        if (err) {
            return res.status(500).json(getJsonForInternalError(err.message))
        }
        if (result.length === 0) {
            return res.status(400).json({
                result: "error",
                type: "account-not-exists",
                message: "Account doesn't exists!"
            })
        }
        else {
            res.status(200).json({
                result: "success",
                firstname: result[0].firstname,
                lastname: result[0].lastname,
                id: result[0].id,
                email: result[0].email,
                isVerified: result[0].isVerified
            })
        }

    })


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

function validateSignup(req) {
    const lettersRegex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/

    if (req.body.email && req.body.password && req.body.firstname && req.body.lastname) {
        if (emailRegex.test(req.body.email) && passwordRegex.test(req.body.password) && lettersRegex.test(req.body.lastname) && lettersRegex.test(req.body.firstname)) {
            return true
        }
        else {
            return false
        }
    }
    else {
        return false
    }
}
function validateLogin(req) {
    if (req.body.email && req.body.password) {
        if (emailRegex.test(req.body.email) && passwordRegex.test(req.body.password)) {
            return true
        }
        else {
            return false
        }
    } else {
        return false
    }

}

function validateChangePassword(req) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&_]{8,}$/
    if (req.body.currentPassword && req.body.newPassword) {
        if (passwordRegex.test(req.body.currentPassword) && passwordRegex.test(req.body.newPassword)) {
            return true
        }
        else {
            return false
        }
    }
    else {
        return false
    }
}