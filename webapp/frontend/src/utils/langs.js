let lang = {}
let language = ""
let availableLanguages = ["en", "fr"]

function init() {
    let navigatorLanguage = navigator.language || navigator.userLanguage
    language = navigatorLanguage.substring(0, 2).toLowerCase()
    if (!availableLanguages.includes(language)) {
        language = "en"
    }
}
function translate(key) {
    return lang[key]
}
function setLang(json) {
    lang = json
}

export { translate, setLang, language, lang, init }