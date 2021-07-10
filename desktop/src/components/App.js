import axios from "axios"
import { Component } from "react"
import { withTranslation } from 'react-i18next'
import "../i18n"
import { readToken, sendToAuthPage } from "../utils/auth-utils"
import Loading from "./Loading"
import { Redirect } from 'react-router-dom'

import "./css/App.css"

class App extends Component {
    state = {
        token: "",
        isLoading: true
    }

    componentDidMount() {

        if (readToken(this.props)) {
            this.setState({ token: readToken(this.props) })
            axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/info`, { headers: { "Authorization": `Bearer ${readToken(this.props)}` } })
                .then(result => {
                    this.setState({ isLoading: false })
                })
                .catch(err => {
                    sendToAuthPage(this.props)
                })
        }
        else {
            sendToAuthPage(this.props)
            return
        }

    }
    render() {
        const { token, isLoading } = this.state

        return (

            <>
                {isLoading && <Loading />}
                {!isLoading && <Redirect path="/" to={{ pathname: "/dashboard/passwords", state: { token: token } }} />}
            </>

        )
    }
}

export default withTranslation()(App)