import { Component } from "react"
import "./css/Updater.css"
import Swal from 'sweetalert2'
import { withTranslation } from 'react-i18next'
import "./../i18n"
import { isDarkTheme } from "./../utils/themes-utils"
import { LinearProgress } from "@material-ui/core"


class Updater extends Component {


    state = {
        updateText: "",
        progress: 0
    }

    componentDidMount() {
        const { t } = this.props
        const updaterContent = document.querySelector(".updater-content")
        updaterContent.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        updaterContent.style.setProperty("--bg-theme", isDarkTheme() ? "#212121" : "white")
        updaterContent.style.setProperty("--bg-bar-theme", isDarkTheme() ? "#333" : "#E9E9E9")

        this.setState({ updateText: t("updater.searching-for-updates") + "..." })

        window.ipc.send("checkForUpdates")


        window.ipc.receive("setUpdateProgress", (percent) => {
            this.setState({ updateText: t("updater.downloading-update") + "... (" + percent + "%)" })
            this.setState({ progress: percent })
        })
        window.ipc.receive("updateError", (errorMessage) => {
            this.openErrorBox(errorMessage)
        })
        window.ipc.receive("updateFinished", () => {
            this.props.history.push("/")
        })
        window.ipc.receive("updateAvailableMac", () => {
            const { t } = this.props
            Swal.fire({
                title: t("updater.update-available"),
                html: `${t("updater.new-update-available")}<br /><span class='update-link'>${t("updater.click-here")}</span> ${t("updater.to-download-new-release")}`,
                icon: "info",
                confirmButtonColor: "#54c2f0",
                background: isDarkTheme() ? " #333" : "white"
            }
            ).then(() => {
                this.props.history.push("/")
            })


            const swal2 = document.querySelectorAll("#swal2-title, #swal2-content")
            swal2.forEach(element => {
                element.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
            })
            const updateLink = document.querySelector(".update-link")
            updateLink.addEventListener("click", function () {
                window.ipc.send("openReleasesLink")
            })
        })
    }
    openErrorBox(message) {
        const { t } = this.props
        Swal.fire({
            title: t("errors.error"),
            text: message,
            icon: "error",
            confirmButtonColor: "#54c2f0",
            background: isDarkTheme() ? " #333" : "white"
        }
        ).then(() => {
            this.props.history.push("/")
        })
        const swal2 = document.querySelectorAll("#swal2-title, #swal2-content")
        swal2.forEach(element => {
            element.style.setProperty("--text-theme", isDarkTheme() ? "white" : "#121212")
        })
    }

    render() {
        const { updateText, progress } = this.state
        return (

            <div className="updater-content">
                <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="logo" className="icon" width={250} />
                <h2>{updateText}</h2>
                <LinearProgress variant={progress === 0 ? "indeterminate" : "determinate"} value={progress} />

            </div>)
    }
}

export default withTranslation()(Updater)