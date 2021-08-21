const main = require("../../electron")
const axios = require("axios")
const logger = require("./logger")
const ConfigManager = require("./configmanager")

exports.checkEmailConfirmation = function (email, password) {
    const interval = setInterval(() => {
        axios.post(`${main.SERVER_URL}/api/auth/email/validated`, { email: email })
            .then(res => {
                if (res.data.value === true) {
                    clearInterval(interval)

                    axios.post(`${main.SERVER_URL}/api/auth/login`,
                        {
                            email: email,
                            password: password
                        }
                    ).then(res => {
                        if (res.data.result === "success") {
                            ConfigManager.setEmail(email)
                            ConfigManager.setToken(res.data.token)

                            ConfigManager.saveConfig()
                            main.win.webContents.send("emailValidated")
                        }
                    })
                        .catch(err => {
                            main.win.webContents.send("emailValidationError")
                            logger.error("Error while logging in: " + err.response.message)
                        })
                }
            })
            .catch(err => {
                main.win.webContents.send("emailValidationError")
                logger.error(err.response.message)
            })
    }, 5000)
}
exports.signup = function (lastname, firstname, email, password, lang) {
    axios.post(`${main.SERVER_URL}/api/auth/signup`,
        {
            lastname: lastname,
            firstname: firstname,
            email: email,
            password: password,
            lang: lang
        }
    ).then(res => {
        if (res.data.result === "success") {
            logger.log("Sucessfully authenticated to " + email)
            main.win.webContents.send("signupSuccess")
        }
    }).catch(error => {
        logger.error("Signup error: " + error.response.message)
        main.win.webContents.send("signupError", err.response ? err.response.data : undefined)
    })
}
exports.login = function (email, password) {
    axios.post(`${main.SERVER_URL}/api/auth/login`,
        {
            email: email,
            password: password
        }
    ).then(res => {
        if (res.data.result === "success") {
            logger.log("Successfully authenticated to " + email)

            ConfigManager.setEmail(email)
            ConfigManager.setToken(res.data.token)
            ConfigManager.saveConfig()
            main.win.webContents.send("loginSuccess")
        }
    })
        .catch(err => {
            logger.error("Error while logging in: " + err.response.message)
            main.win.webContents.send("loginError", err.response ? err.response.data : undefined)
        })

}
exports.checkAuthentication = function () {
    axios.get(`${main.SERVER_URL}/api/auth/info`, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
        .then(result => main.win.webContents.send("checkAuthenticationResult", "success"))
        .catch(err => main.win.webContents.send("checkAuthenticationResult", "error"))
}
exports.changePassword = function (currentPassword, newPassword) {
    axios.post(`${main.SERVER_URL}/api/auth/change-password/`, {
        currentPassword: currentPassword,
        newPassword: newPassword
    }, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
        .then(() => {
            ConfigManager.setPassword(newPassword)
            main.win.webContents.send("changePasswordResult", { result: "success" })

        })
        .catch(err => {
            main.win.webContents.send("changePasswordResult", { result: "error", error: err.response ? err.response.data : undefined })
        })
}
exports.confirmPassword = function (password) {
    if (ConfigManager.getToken()) {
        axios.get(`${main.SERVER_URL}/api/auth/info`, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
            .then(result => {
                const email = result.data.email
                axios.post(`${main.SERVER_URL}/api/auth/login`,
                    {
                        email: email,
                        password: password
                    }
                ).then(() => {
                    ConfigManager.setPassword(password)
                    main.win.webContents.send("confirmPasswordResult", { result: "success" })

                })
                    .catch(err => {
                        main.win.webContents.send("confirmPasswordResult", { result: "error", error: err.response ? err.response.data : undefined })
                    })
            })
            .catch(() => {
                main.win.webContents.send("goToAuth")
            })
    }
    else {
        main.win.webContents.send("goToAuth")
    }
}
exports.getAccountInfo = function () {
    if (ConfigManager.getToken()) {
        axios.get(`${main.SERVER_URL}/api/auth/info`, { headers: { "Authorization": `Bearer ${ConfigManager.getToken()}` } })
            .then(result => {
                main.win.webContents.send("accountInfoResult", { email: result.data.email, lastname: result.data.lastname, firstname: result.data.firstname })
            })
            .catch(err => {
                main.win.webContents.send("goToAuth")

            })
    }
    else {
        main.win.webContents.send("goToAuth")
    }
}