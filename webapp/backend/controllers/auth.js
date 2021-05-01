const bcyrpt = require("bcrypt")
const mysql = require("mysql")
const jwt = require("jsonwebtoken")
const authUtils = require("../utils/auth-utils")

exports.signup = (req, res, next) => {

    if (validateSignup(req)) {

        authUtils.database.query("SELECT id FROM accounts WHERE email = " + "'" + req.body.email + "'", function (err, result) {
            if (err) {
                return res.status(500).json({
                    result: "error",
                    type: "error-internal",
                    message: "Error : Internal server error!"
                })
            }
            if (result.length === 0) {
                return signupAccount(req, res)
            }
            else {
                return res.status(500).json({
                    result: "error",
                    type: "error-email-already-exists",
                    message: "Error : e-mail already exists!"
                })
            }
        })
    }
    else {
        return res.status(500).json(getJsonForArgumentsError())
    }



}
function getJsonForArgumentsError() {
    return ({
        result: "error",
        type: "error-bad-request-args",
        message: "Error : Bad request arguments!"
    })
}
function signupAccount(req, res) {
    const insertAccountSQL = "INSERT INTO `accounts` (`id`, `email`, `password`, `lastname`, `firstname`) VALUES (NULL, '"
        + req.body.email
        + "', '" + req.body.password
        + "', '" + req.body.lastname
        + "', '" + req.body.firstname + "');"

    authUtils.database.query(insertAccountSQL, function (err, result) {
        if (err) {
            return res.status(500).json({
                result: "error",
                type: "error-internal",
                message: "Error : internal server error!"
            })
        }
        return res.status(201).json({
            result: "success",
            type: "account-created-successfully",
            message: "Account created successfully!"
        })
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
exports.login = (req, res, next) => {
    /*
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ authresult: "error", error: error, errortype: "not-found-erro", message: "Utilisateur non trouvé !" })
            }
            bcyrpt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de pass incorrect !" })

                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
        */
}

exports.logout = (req, res, next) => {


}