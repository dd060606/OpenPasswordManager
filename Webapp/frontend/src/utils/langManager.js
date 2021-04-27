let lang = {}

function setLang(json) {
    lang = json
}
function translate(key) {
    return lang[key]
}

export { translate, setLang }