import "../css/passwords/PasswordItem.css"
import Tooltip from "@material-ui/core/Tooltip"
import { useTranslation } from "react-i18next"
import "../../../i18n"

const PasswordItem = ({ name, url, imageUrl, username, index, onClick }) => {

    const [t] = useTranslation()
    return (<div className="password-item-box">
        <div className="password-item">
            <div className="password-info">
                <img src={imageUrl} className="website-icon" />
                <div>
                    <p className="password-name">{name}</p>
                    <p className="username-text">{username}</p>
                </div>

            </div>


            <div className="password-action">
                <Tooltip title={t("passwords.browse-website")} placement="top">

                    <a href={url} target="_blank" rel="noreferrer" className="browse-to-website-button"><i className="far fa-external-link" /></a>
                </Tooltip>
                <Tooltip title={t("passwords.edit")} placement="top">

                    <button className="edit-password-button"><i className="far fa-edit" /></button>
                </Tooltip>

            </div>


        </div>
        <div className="password-item-line" />
    </div>


    )
}

export default PasswordItem