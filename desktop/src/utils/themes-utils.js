function isSavedThemeValid() {

    return window.ipc.sendSync("isSavedThemeValid")
}
function getSavedTheme() {
    return window.ipc.sendSync("getSavedTheme") === 0 ? "light" : "dark"
}
function saveTheme(theme) {
    window.ipc.send("setTheme", theme === "light" ? 0 : 1)
}
function isDarkTheme() {
    return window.ipc.sendSync("getSavedTheme") === 1

}
export { isSavedThemeValid, getSavedTheme, saveTheme, isDarkTheme }