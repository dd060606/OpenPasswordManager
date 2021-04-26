import './css/Error404.css';
import { Component } from "react"
import { translate } from "../../utils/langManager"

class Error404 extends Component {


    render() {
        return (
            <div className="error404">
                <h1>{translate("error404")}</h1>

                <p>{translate("error404-page-not-found")}</p>
            </div>
        );
    }
}

export default Error404;
