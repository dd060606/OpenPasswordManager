import "../css/dashboards/PasswordItem.css"
import Tooltip from "@material-ui/core/Tooltip"
import { useTranslation } from "react-i18next"
import "../../i18n"
import React, { useEffect } from "react"
import { isDarkTheme } from "../../utils/themes-utils"


const PasswordItem = ({ credential, index, onClick }) => {

    const [t] = useTranslation()

    useEffect(() => {
        const passwordItemBox = document.querySelector(".password-item-box")
        passwordItemBox.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        passwordItemBox.style.setProperty("--line-theme", isDarkTheme() ? "white" : "rgba(0,0,0,0.1)")
        setTimeout(() => {
            let images = document.querySelectorAll('.password-item-box .password-info img')
            images.forEach(image => {
                if (!image.naturalHeight && !image.complete) {
                    image.src = `${process.env.PUBLIC_URL}/assets/images/unknown_46x30.png`
                }

            })
        }, 100)

    })
    return (<div className="password-item-box" >
        <div className="password-item" onClick={event => {
            if (event.currentTarget === event.target) {
                onClick(credential)
            }
        }}>
            <div className="password-info">
                <img src={credential.smallImageURL}
                    alt="" className="website-icon" />
                <div>
                    <p className="password-name">{credential.name}</p>
                    <p className="username-text">{credential.username}</p>
                </div>

            </div>


            <div className="password-action">
                <Tooltip title={t("passwords.browse-website")} placement="top">

                    <p onClick={() => window.ipc.send("openExternalLink", credential.url)} className="browse-to-website-button"><i className="far fa-external-link" /></p>
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