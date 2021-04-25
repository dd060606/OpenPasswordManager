import './css/Downloads.css';
import { translate } from "../utils/langManager"

function App() {
    return (
        <div className="downloads">
            <h1>{translate("downloads")}</h1>
            <h3>{translate("desktop-apps")}</h3>

            <div className="platforms">
                <div className="platform">
                    <p className="platform-name">Windows</p>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/windows.png`} className="platform-img" alt="windows" width={100} />
                    <a href="" className="download-btn">{translate("download")}</a>

                </div>
                <div className="platform">
                    <p className="platform-name">Linux</p>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/linux.png`} className="platform-img" alt="linux" width={100} />
                    <a href="" className="download-btn">{translate("download")}</a>

                </div>
                <div className="platform">
                    <p className="platform-name">MacOS</p>
                    <img src={`${process.env.PUBLIC_URL}/assets/images/macos.png`} className="platform-img" alt="macos" width={100} />
                    <a href="" className="download-btn">{translate("download")}</a>
                </div>
            </div>

            <a href="https://github.com/dd060606/OpenPasswordManager/releases" rel="noopener noreferrer" target="_blank" className="all-releases">{translate("all-releases")}</a>
        </div>
    );
}

export default App;
