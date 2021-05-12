import axios from "axios"
import { Component } from "react"
import { withTranslation } from 'react-i18next'
import "../i18n"
import { cookies } from "../index"

class App extends Component {
    state = {
        token: ""
    }

    componentDidMount() {
        const { token } = this.state
        if (this.props.location.state && this.props.location.state.token && this.props.location.state.token !== "") {
            this.setState({ token: this.props.location.state.token })
        }
        else if (cookies.get("token") !== undefined && cookies.get("token") !== "") {
            this.setState({ token: cookies.get("token") })
        }
        else {
            this.props.history.push("/auth/login")
            return
        }




    }
    render() {
        const { token } = this.state
        return <p>Connected : {token}</p>
    }
}

export default withTranslation()(App)