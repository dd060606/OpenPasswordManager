import { cookies } from "../index"
function readToken(props) {

    if (props.location.state && props.location.state.token && props.location.state.token !== "") {
        return props.location.state.token
    }
    else if (cookies.get("token") !== undefined && cookies.get("token") !== "") {
        return cookies.get("token")
    }
    else {
        return undefined
    }


}

function saveToken(token) {
    cookies.set("token", token, { path: "/", secure: true, sameSite: "strict", maxAge: 3600 })
}

export { readToken, saveToken }