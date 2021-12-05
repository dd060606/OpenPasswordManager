import { Component } from "react"
import { withTranslation } from 'react-i18next'
import "../i18n"
import Loading from "./Loading"
import { Redirect, withRouter } from 'react-router-dom'
import "./css/App.css"

class App extends Component {
    state = {
        isLoading: true
    }

    componentDidMount() {
        if (window.ipc.sendSync("isCheckedForUpdates")) {
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
        else {
            this.props.history.push("/updater")
        }
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



export default withTranslation()(withRouter(App))