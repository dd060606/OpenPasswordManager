import { cookies } from "../index"
function readToken(props) {

    if (props.location.state && props.location.state.token && props.location.state.token !== "") {
        return props.location.state.token
    }
    else {
        return undefined
    }


}
function getEmail() {
    return cookies.get("email")
}
function saveEmail(email) {
    cookies.set("email", email, { path: "/" })
}
function deleteEmailCookie() {
    cookies.remove("email", { path: "/" })
}
function isEmailSaved() {
    if (cookies.get("email")) {
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