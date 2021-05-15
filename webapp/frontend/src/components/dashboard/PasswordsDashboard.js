import { Component } from "react"
import "./css/PasswordsDashboard.css"
import DashboardNav from "./DashboardNav"

class Dashboard extends Component {


    render() {


        return (
            <div className="dashboard-content">
                <DashboardNav />

            </div>
        )
    }
}

export default Dashboard