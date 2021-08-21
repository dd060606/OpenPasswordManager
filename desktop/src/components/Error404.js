import './css/Error404.css';
import { Component } from "react"
import { withTranslation } from 'react-i18next';
import "../i18n"

class Error404 extends Component {


    render() {
        const { t } = this.props;
        return (
            <div className="error404">
                <h1>{t("errors.error404")}</h1>

                <p>{t("errors.error404-page-not-found")}</p>
            </div>
        );
    }
}

export default withTranslation()(Error404);
