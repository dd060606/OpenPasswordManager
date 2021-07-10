import { Component } from "react"
import { isDarkTheme } from "../utils/themes-utils"
import "./css/Loading.css"


class Loading extends Component {

    componentDidMount() {
        const loadingContent = document.querySelector(".loading-content")
        loadingContent.style.setProperty("--bg-theme", isDarkTheme() ? "#212121" : "white")
        loadingContent.style.setProperty("--spinner-theme", isDarkTheme() ? "#333" : "#E0F3FC")

    }
    render() {


        return (
            <div className="loading-content" >

                <div className="spinner" ></div>
                <img src={`${process.env.PUBLIC_URL}/assets/images/icon.png`} alt="icon" className="icon" width={100} height={120} />




            </div >)

    }
}

export default Loading