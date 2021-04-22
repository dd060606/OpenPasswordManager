let language = "en"
let langJSON = {}

function setLanguage(lang) {
    language = lang
}
function setLangJSON(json) {
    langJSON = json
}
function translate(key) {
    return langJSON[key]
}

export { translate, setLanguage, language, setLangJSON }