import './css/Home.css';
import { translate } from "../utils/langManager"

function App() {
  return (
    <div className="home">
      <div className="home-header">
        <h1>OpenPasswordManager</h1>
        <img src={`${process.env.PUBLIC_URL}/assets/images/icon.png`} className="icon" alt="icon" width={50} />
        <h4 className="slogan">{translate("home-slogan")}</h4>
      </div>
      <section className="features-section">
        <h4 className="features-title">{translate("features")}</h4>

        <div className="features">
          <div className="feature">
            <i className="fad fa-browser feature-icon"></i>
            <div className="feature-info">
              <p className="feature-title">{translate("home-feature-webapp-title")}</p>
              <p className="feature-desc">{translate("home-feature-webapp-desc")}</p>

            </div>
          </div>
          <div className="feature">
            <i className="fad fa-desktop feature-icon"></i>

            <div className="feature-info">
              <p className="feature-title">{translate("home-feature-desktopapps-title")}</p>
              <p className="feature-desc">{translate("home-feature-desktopapps-desc")}</p>

            </div>
          </div>
          <div className="feature">
            <i className="fad fa-server feature-icon"></i>

            <div className="feature-info">
              <p className="feature-title">{translate("home-feature-db-store-title")}</p>
              <p className="feature-desc">{translate("home-feature-db-store-desc")}</p>

            </div>

          </div>
          <div className="feature">
            <i className="fad fa-lock-alt feature-icon"></i>

            <div className="feature-info">
              <p className="feature-title">{translate("home-feature-password-title")}</p>
              <p className="feature-desc">{translate("home-feature-password-desc")}</p>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default App;
