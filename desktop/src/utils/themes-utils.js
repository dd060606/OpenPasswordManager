function isSavedThemeValid() {

    return window.ipc.sendSync("is-saved-theme-valid")
}
function getSavedTheme() {
    return window.ipc.sendSync("get-saved-theme") === 0 ? "light" : "dark"
}
function saveTheme(theme) {
    window.ipc.send("set-theme", theme === "light" ? 0 : 1)
}
function isDarkTheme() {
    return window.ipc.sendSync("get-saved-theme") === 1

}
export { isSavedThemeValid, getSavedTheme, saveTheme, isDarkTheme }