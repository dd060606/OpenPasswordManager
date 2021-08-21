function readToken(props) {
    if (props.location.state && props.location.state.token && props.location.state.token !== "") {
        return props.location.state.token
    }
    else {
        return undefined
    }
}
function getEmail() {
    return window.ipc.sendSync("getEmail")
}
function saveEmail(email) {
    window.ipc.send("saveEmail", email)
}

function isEmailSaved() {
    if (window.ipc.sendSync("getEmail")) {
        return true
    }
    else {
        return false
    }
}

export { readToken, saveEmail, isEmailSaved, getEmail }