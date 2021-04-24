import './css/Downloads.css';
import { translate } from "../utils/langManager"

function App() {
    return (
        <div className="downloads">
            <h1>{translate("desktop-apps")}</h1>
            <h2>{translate("downloads")} : </h2>
        </div>
    );
}

export default App;
