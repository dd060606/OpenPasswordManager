import "../css/dashboards/PasswordItem.css"
import Tooltip from "@material-ui/core/Tooltip"
import { useTranslation } from "react-i18next"
import "../../i18n"
import React, { useEffect, useState } from "react"
import { isDarkTheme } from "../../utils/themes-utils"


const PasswordItem = ({ credential, index, onClick }) => {

    const [t] = useTranslation()
    const [errorImage, setErrorImage] = useState(false);

    useEffect(() => {
        const passwordItemBox = document.querySelector(".password-item-box")
        passwordItemBox.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        passwordItemBox.style.setProperty("--line-theme", isDarkTheme() ? "white" : "rgba(0,0,0,0.1)")
    })
    let smallName = credential.name[0].toUpperCase() + (credential.name.length >= 2 ? credential.name[1] : "")

    return (<div className="password-item-box" >
        <div className="password-item" onClick={event => {
            if (event.currentTarget === event.target) {
                onClick(credential)
            }
        }}>
            <div className="password-info">
                {!errorImage &&
                    <img src={credential.smallImageURL}
                        alt="" className="website-icon" onError={event => setErrorImage(true)} />
                }
                {
                    errorImage &&
                    <div className="website-icon" id="no-img-box">
                        <p>{smallName}</p>
                    </div>
                }
                <div>
                    <p className="password-name">{credential.name}</p>
                    <p className="username-text">{credential.username}</p>
                </div>

            </div>


            <div className="password-action">
                <Tooltip title={t("passwords.browse-website")} placement="top">

                    <a href={credential.url} target="_blank" rel="noreferrer" className="browse-to-website-button"><i className="far fa-external-link" /></a>
                </Tooltip>
                <Tooltip title={t("passwords.edit")} placement="top">

                    <button className="edit-password-button" onClick={() => onClick(credential)}><i className="far fa-edit" /></button>
                </Tooltip>

            </div>


        </div>
        <div className="password-item-line" />
    </div >


    )
}

export default PasswordItem