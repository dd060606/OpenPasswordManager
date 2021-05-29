import { cookies } from "../index"
function readToken(props) {

    if (props.location.state && props.location.state.token && props.location.state.token !== "") {
        return props.location.state.token
    }
    else if (cookies.get("token")) {
        return cookies.get("token")
    }
    else {
        return undefined
    }


}

function saveToken(token) {
    cookies.set("token", token, { path: "/", secure: true, sameSite: "strict", maxAge: 3600 })
}
function logout() {
    cookies.remove("token", { path: "/" })
}
function isTokenSaved() {
    if (cookies.get("token")) {
        return true
    }
    else {
        return false
    }
}
function sendToAuthPage(props) {
    props.history.push("/auth/login")
}
export { readToken, saveToken, logout, isTokenSaved, sendToAuthPage }