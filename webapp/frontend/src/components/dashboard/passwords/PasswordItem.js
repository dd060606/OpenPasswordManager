import "../css/passwords/PasswordItem.css"
import Tooltip from "@material-ui/core/Tooltip"


const PasswordItem = ({ name, url, imageUrl, index, onClick }) => {


    return (<div className="password-item-box">
        <div className="password-item">
            <div className="password-info">
                <img src={imageUrl} alt="website-icon" className="website-icon" />
                <p className="password-name">{name}</p>
            </div>


            <div className="password-action">
                <Tooltip title={"Test"} placement="top">

                    <a href={url} target="_blank" rel="noreferrer" className="browse-to-website-button"><i className="far fa-external-link" /></a>
                </Tooltip>
                <Tooltip title={"Test"} placement="top">

                    <button className="edit-password-button"><i className="far fa-edit" /></button>
                </Tooltip>

            </div>


        </div>
        <div className="password-item-line" />
    </div>


    )
}

export default PasswordItem