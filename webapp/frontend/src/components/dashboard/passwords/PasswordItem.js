import "../css/passwords/PasswordItem.css"
import Tooltip from "@material-ui/core/Tooltip"
import { useTranslation } from "react-i18next"
import "../../../i18n"
import React from "react"
import { isDarkTheme } from "../../../utils/themes-utils"

const PasswordItem = ({ credential, index, onClick }) => {

    const [t] = useTranslation()
    return (<div className="password-item-box" >
        <div className="password-item" onClick={event => {
            if (event.currentTarget === event.target) {
                onClick(credential)
            }
        }}>
            <div className="password-info">
                <span style={{ backgroundImage: `url(${credential.smallImageURL})` }} alt="" className="website-icon" />
                <div>
                    <p className="password-name">{credential.name}</p>
                    <p className="username-text">{credential.username}</p>
                </div>

            </div>


            <div className="password-action">
                <Tooltip title={t("passwords.browse-website")} placement="top">

                    <a href={credential.url} target="_blank" rel="noreferrer" className="browse-to-website-button"><i className="far fa-external-link" style={{ color: isDarkTheme() ? "white" : "#121212" }} /></a>
                </Tooltip>
                <Tooltip title={t("passwords.edit")} placement="top">

                    <button className="edit-password-button" onClick={() => onClick(credential)}><i className="far fa-edit" style={{ color: isDarkTheme() ? "white" : "#121212" }} /></button>
                </Tooltip>

            </div>


        </div>
        <div className="password-item-line" style={{
            backgroundColor: isDarkTheme() ? "white" : "rgba(0,0,0,0.1)"
        }} />
    </div >


    )
}

export default PasswordItem