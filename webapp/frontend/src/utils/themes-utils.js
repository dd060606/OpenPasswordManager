import { cookies } from "../index"
function isSavedThemeValid() {
    return cookies.get("theme") && (cookies.get("theme") === "light" || cookies.get("theme") === "dark")
}
function getSavedTheme() {
    return cookies.get("theme")
}
function saveTheme(theme) {
    cookies.set("theme", theme, { path: "/" })
}
function isDarkTheme() {
    return cookies.get("theme") === "dark"
}
export { isSavedThemeValid, getSavedTheme, saveTheme, isDarkTheme }