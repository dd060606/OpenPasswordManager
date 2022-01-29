const nodemailer = require("nodemailer")
const fs = require("fs")
const handlebars = require('handlebars')
const db = require("../utils/database").database
const logger = require("../utils/logger")

const jwt = require("jsonwebtoken")

require('dotenv').config()


exports.resendEmail = (req, res, next) => {
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
}
exports.sendEmail = sendEmail
function sendEmail(lang, req) {
    fs.readFile(`emails/${lang}/account-confirmation-template.html`, 'utf8', (err, data) => {
        if (!err) {
            db.query(`SELECT * FROM \`${process.env.DB_OPM_ACCOUNTS_TABLE}\` WHERE email = ?`, [req.body.email], function (err, result) {
                if (!err) {
                    const transporter = nodemailer.createTransport({
                        host: process.env.EMAIL_HOST,
                        port: process.env.EMAIL_PORT,
                        secure: true,
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASSWORD
                        }
                    });
                    const url = process.env.EMAIL_CONFIRMATION_URL.endsWith("/") ? process.env.EMAIL_CONFIRMATION_URL + jwt.sign({ userId: result[0].id }, process.env.AUTH_TOKEN_KEY, { expiresIn: "24h" }) : process.env.EMAIL_CONFIRMATION_URL + "/" + jwt.sign({ userId: result[0].id }, process.env.AUTH_TOKEN_KEY, { expiresIn: "24h" })
                    let template = handlebars.compile(data)
                    let replacements = {
                        firstname: result[0].firstname,
                        email: req.body.email,
                        emailLink: url
                    }
                    let htmlToSend = template(replacements)
                    const mailOptions = {
                        from: "\"OpenPasswordManager\" <" + process.env.EMAIL_USER + ">",
                        to: req.body.email,
                        subject: "E-mail confirmation",
                        html: htmlToSend
                    }
                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                        }
                    })
                }
            })

        }
    })
}

exports.emailConfirmation = (req, res, next) => {
    try {
        if (!req.body.token) {
            return res.status(400).json(getJsonForArgumentsError())
        }
        const decodedToken = jwt.verify(req.body.token, process.env.AUTH_TOKEN_KEY)
        const userId = decodedToken.userId
        db.query(`SELECT * FROM \`${process.env.DB_OPM_ACCOUNTS_TABLE}\` WHERE id = ?`, [userId], function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError(err))
            }
            if (result.length > 0) {
                if (result[0].isVerified === 1) {
                    return res.status(400).json({
                        result: "error",
                        type: "email-already-verified",
                        message: "E-mail already verified!"
                    });
                }
                db.query(`UPDATE \`${process.env.DB_OPM_ACCOUNTS_TABLE}\` SET \`isVerified\` = '1' WHERE \`${process.env.DB_OPM_ACCOUNTS_TABLE}\`.\`id\` = ?`, [userId], function (err2, result2) {
                    if (err) {
                        return res.status(500).json(getJsonForInternalError(err.message))
                    }
                    logger.info(`${req.headers['x-real-ip'] || req.connection.remoteAddress} verified e-mail : ${result[0].email} (${result[0].id})`)

                    return res.status(200).json({
                        result: "success",
                        type: "email-successfully-verified",
                        message: "E-mail successfully verified!",
                        email: result[0].email
                    })
                })
            }
            else {
                return res.status(400).json({
                    result: "error",
                    type: "invalid-account",
                    message: "Invalid Account!"
                });
            }
        })
    } catch {
        return res.status(400).json({
            result: "error",
            type: "invalid-account",
            message: "Invalid Account!"
        });
    }

}
exports.isEmailConfirmed = (req, res, next) => {
    if (req.body.email) {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailRegex.test(req.body.email)) {
            db.query(`SELECT * FROM \`${process.env.DB_OPM_ACCOUNTS_TABLE}\` WHERE email = ?`, [req.body.email], function (err, result) {
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
                    return res.status(200).json({
                        result: "success",
                        value: result[0].isVerified === 1
                    })

                }
            })

        }
        else {
            return res.status(400).json(getJsonForArgumentsError())
        }
    }
    else {
        return res.status(400).json(getJsonForArgumentsError())

    }
}
function getJsonForInternalError(message) {
    logger.error(message)
    return ({
        result: "error",
        type: "internal-error",
        message: "Error : Internal server error!"
    })
}