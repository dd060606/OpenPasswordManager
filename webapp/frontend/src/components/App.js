import axios from "axios"
import { Component } from "react"
import { withTranslation } from 'react-i18next'
import "../i18n"
import { readToken } from "../utils/auth-utils"
import Loading from "./Loading"
import { Redirect } from 'react-router-dom'

import "./css/App.css"

class App extends Component {
    state = {
        token: "",
        isLoading: false
    }

    componentDidMount() {
        if (readToken(this.props)) {
            this.setState({ token: readToken(this.props) })
        }
        else {
            this.props.history.push("/auth/login")
            return
        }
    }
    render() {
        const { token, isLoading } = this.state


        return (

            <>
                { isLoading && <Loading />}
                { !isLoading && <Redirect path="/" to={{ pathname: "/dashboard/passwords", state: { token: token } }} />}
            </>

        )
    }
}

export default withTranslation()(App)