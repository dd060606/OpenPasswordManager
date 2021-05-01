require('dotenv').config();

const mysql = require("mysql")
const databaseHost = process.env.DB_HOST
const databaseName = process.env.DB_NAME
const databaseUsername = process.env.DB_USERNAME
const databasePassword = process.env.DB_PASSWORD


module.exports.tokenKey = process.env.AUTH_TOKEN_KEY

const database = mysql.createConnection({
    host: databaseHost,
    user: databaseUsername,
    password: databasePassword,
    database: databaseName
});


module.exports.initDatabase = function () {
    database.connect(function (err) {
        if (err) throw err;
        console.log("Connected to database!");
    });

    database.query("CREATE TABLE IF NOT EXISTS `" + databaseName + "`.`" + process.env.DB_OPM_ACCOUNTS_TABLE + "` ( `id` INT NOT NULL AUTO_INCREMENT ,"
        + " `email` VARCHAR(255) NOT NULL ,"
        + " `password` TEXT NOT NULL ,"
        + " `lastname` VARCHAR(255) NOT NULL ,"
        + " `firstname` VARCHAR(255) NOT NULL ," +
        " PRIMARY KEY (`id`)) ENGINE = InnoDB;", function (err, result) {
            if (err) throw err;
        })
}

module.exports.database = database