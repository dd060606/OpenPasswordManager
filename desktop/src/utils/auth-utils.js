function readToken(props) {
    if (props.location.state && props.location.state.token && props.location.state.token !== "") {
        return props.location.state.token
    }
    else {
        return undefined
    }
}
function getEmail() {
    return window.ipc.sendSync("get-email")
}
function saveEmail(email) {
    window.ipc.send("save-email", email)
}
function deleteEmailCookie() {
    window.ipc.send("delete-email")
}
function isEmailSaved() {
    if (window.ipc.sendSync("get-email")) {
        return true
    }
    else {
        return false
    }
}
function sendToAuthPage(props) {
    props.history.push("/auth/login")
}
export { readToken, saveEmail, deleteEmailCookie, isEmailSaved, sendToAuthPage, getEmail }