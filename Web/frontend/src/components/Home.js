import './css/Home.css';
import { translate } from "../utils/langManager"

function App() {
  return (
    <div className="home">
      <div className="home-header">
        <h1>OpenPasswordManager</h1>
        <img src={`${process.env.PUBLIC_URL}/assets/images/icon.png`} class="icon" alt="icon" width={50} />
        <h4 className="slogan">{translate("home-slogan")}</h4>
      </div>
      <section className="features-section">
        <h4 className="features-title">{translate("features")}</h4>

        <div className="features">
          <div className="feature">
            <i class="fad fa-server feature-icon"></i>

            <div className="feature-info">
              <p className="feature-title">Stockage des mots de passe dans votre base de donnée</p>
              <p className="feature-desc">Vous devez ajouter votre base de donnée MYSQL à votre compte pour pouvoir stocker tous vos mots de passes dans votre base de donnée de façon sécurisée</p>

            </div>

          </div>
          <div className="feature">
            <i class="fad fa-lock-alt feature-icon"></i>

            <div className="feature-info">
              <p className="feature-title">Mots de passe sécurisé</p>
              <p className="feature-desc">Vos mots de passe sont sauvegardés sur votre base de donnée de façon sécurisé</p>

            </div>
          </div>
          <div className="feature">
            <i class="fad fa-server feature-icon"></i>

            <div className="feature-info">
              <p className="feature-title">Stockage des mots de passe dans votre base de donnée</p>
              <p className="feature-desc">Vous devez ajouter votre base de donnée MYSQL à votre compte pour pouvoir stocker tous vos mots de passes dans votre base de donnée de façon sécurisée</p>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
