const bcyrpt = require("bcrypt")
const mysql = require("mysql")
const jwt = require("jsonwebtoken")
const authUtils = require("../utils/auth-utils")
const logger = require("../utils/logger")
const nodemailer = require("nodemailer")
const fs = require("fs")
const handlebars = require('handlebars')
const { UV_FS_O_FILEMAP } = require("constants")
const { send } = require("process")
require('dotenv').config()





exports.signup = (req, res, next) => {

    if (validateSignup(req)) {

        authUtils.database.query("SELECT id FROM " + process.env.DB_OPM_ACCOUNTS_TABLE + " WHERE email = " + "'" + req.body.email + "'", function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError())
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

function validateSignup(req) {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const lettersRegex = /^[A-Za-z]+$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*_?&]{8,}$/

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
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*_?&]{8,}$/
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
function signupAccount(req, res) {


    bcyrpt.hash(req.body.password, 10)
        .then(hash => {

            const insertAccountSQL = "INSERT INTO `" + process.env.DB_OPM_ACCOUNTS_TABLE + "` (`id`, `email`, `password`, `lastname`, `firstname`, `isVerified`) VALUES (NULL, '"
                + req.body.email
                + "', '" + hash
                + "', '" + req.body.lastname
                + "', '" + req.body.firstname
                + "', '" + "0"
                + "');"

            authUtils.database.query(insertAccountSQL, function (err, result) {
                if (err) {
                    return res.status(500).json(getJsonForInternalError())
                }

                if (req.body.lang) {
                    fs.exists("emails/" + req.body.lang + "/account-confirmation-template.html", function (exists) {
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


                logger.info("New account created : " + req.body.email + " - " + req.body.lastname + " " + req.body.firstname + " from " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress))
                return res.status(201).json({
                    result: "success",
                    type: "account-successfully-created",
                    message: "Account successfully created!",

                })
            })
        })
        .catch(error => res.status(500).json(getJsonForInternalError()));


}
exports.resendEmail = (req, res, next) => {
    if (req.body.lang) {
        fs.exists("emails/" + req.body.lang + "/account-confirmation-template.html", function (exists) {
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

function sendEmail(lang, req) {
    fs.readFile("emails/" + lang + "/account-confirmation-template.html", 'utf8', (err, data) => {
        if (!err) {
            authUtils.database.query("SELECT * FROM `" + process.env.DB_OPM_ACCOUNTS_TABLE + "` WHERE email = \"" + req.body.email + "\"", function (err, result) {
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
                        firstname: req.body.firstname,
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
exports.login = (req, res, next) => {

    if (validateLogin(req)) {

        authUtils.database.query("SELECT * FROM `" + process.env.DB_OPM_ACCOUNTS_TABLE + "` WHERE email = \"" + req.body.email + "\"", function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError())
            }
            if (result.length === 0) {
                return res.status(400).json({
                    result: "error",
                    type: "account-not-exists",
                    message: "Account doesn't exists!"
                })
            }
            else {
                bcyrpt.compare(req.body.password, result[0].password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({
                                result: "error",
                                type: "wrong-password",
                                message: "Wrong password!"
                            })

                        }
                        logger.info(req.headers['x-forwarded-for'] || req.connection.remoteAddress + " logged to " + req.body.email + " (" + result[0].id + ")")

                        if (result[0].isVerified === 1) {
                            res.status(200).json({
                                token: jwt.sign({ userId: result[0].id },
                                    process.env.AUTH_TOKEN_KEY, { expiresIn: "24h" }
                                )
                            })
                        }
                        else {
                            res.status(200).json({
                                token: "email-not-verified"
                            })
                        }


                    })
                    .catch(() => res.status(500).json(getJsonForInternalError()))
            }

        })
    }
    else {
        return res.status(400).json(getJsonForArgumentsError())
    }

}
exports.emailConfirmation = (req, res, next) => {
    try {
        const decodedToken = jwt.verify(req.params.token, process.env.AUTH_TOKEN_KEY)
        const userId = decodedToken.userId
        authUtils.database.query("SELECT * FROM `" + process.env.DB_OPM_ACCOUNTS_TABLE + "` WHERE id = \"" + userId + "\"", function (err, result) {
            if (err) {
                return res.status(500).json(getJsonForInternalError())
            }
            if (result.length > 0) {
                if (result[0].isVerified === 1) {
                    return res.status(400).json({
                        result: "error",
                        type: "email-already-verified",
                        message: "E-mail already verified!"
                    });
                }
                authUtils.database.query("UPDATE `" + process.env.DB_OPM_ACCOUNTS_TABLE + "` SET `isVerified` = '1' WHERE `" + process.env.DB_OPM_ACCOUNTS_TABLE + "`.`id` = " + userId + ";", function (err2, result2) {
                    if (err) {
                        return res.status(500).json(getJsonForInternalError())
                    }
                    logger.info(req.headers['x-forwarded-for'] || req.connection.remoteAddress + " verified e-mail : " + result[0].email + " (" + result[0].id + ")")

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