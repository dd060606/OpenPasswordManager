exports.info = (message) => {

    let date = new Date()
    let time = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours()
        + ":" + date.getMinutes() + ":" + date.getSeconds()

    console.log("[INFO] (" + time + ") " + message);
}