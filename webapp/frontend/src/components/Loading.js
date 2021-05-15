import { Component } from "react"
import "./css/Loading.css"


class Loading extends Component {


    render() {



        return (
            <div className="loading-content">

                <div className="spinner"></div>
                <img src={`${process.env.PUBLIC_URL}/assets/images/icon.png`} alt="icon" className="icon" width={100} height={120} />




            </div >)

    }
}

export default Loading