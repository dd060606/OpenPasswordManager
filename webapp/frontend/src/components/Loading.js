import { Component } from "react"
import { isDarkTheme } from "../utils/themes-utils"
import "./css/Loading.css"


class Loading extends Component {

    componentDidMount() {
        let spinner = document.querySelector(".loading-content > .spinner")
        spinner.style.setProperty("--theme", isDarkTheme() ? "#333" : "#E0F3FC")
    }
    render() {


        return (
            <div className="loading-content" style={{ backgroundColor: isDarkTheme() ? "#121212" : "white" }}>

                <div className="spinner" ></div>
                <img src={`${process.env.PUBLIC_URL}/assets/images/icon.png`} alt="icon" className="icon" width={100} height={120} />




            </div >)

    }
}

export default Loading