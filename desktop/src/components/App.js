import { Component } from "react"
import { withTranslation } from 'react-i18next'
import "../i18n"
import Loading from "./Loading"
import { Redirect } from 'react-router-dom'

import "./css/App.css"

class App extends Component {
    state = {
        isLoading: true
    }

    componentDidMount() {
        window.ipc.send("checkAuthentication")
        window.ipc.receive("checkAuthenticationResult", (result) => {
            if (result === "success") {
                this.setState({ isLoading: false })
            }
            else {
                this.props.history.push("/auth/login")
            }
        })


    }
    render() {
        const { isLoading } = this.state

        return (

            <>
                {isLoading && <Loading />}
                {!isLoading && <Redirect path="/" to={{ pathname: "/dashboard/passwords" }} />}
            </>

        )
    }
}

export default withTranslation()(App)