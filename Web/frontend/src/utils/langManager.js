let language = "en"
let lang = {}

function setLanguage(lang) {
    language = lang
    fetch('./langs/' + language + ".json", {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    })
        .then(res => res.json())
        .then(json => { lang = json })
    console.log(lang)
}
function translate(key) {
    return "Test"
}
export { translate, setLanguage }