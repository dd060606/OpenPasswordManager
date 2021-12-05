require('dotenv').config()

const logger = require("./logger")
const mysql = require("mysql2")
const databaseHost = process.env.DB_HOST
const databaseName = process.env.DB_NAME
const databaseUsername = process.env.DB_USERNAME
const databasePassword = process.env.DB_PASSWORD


module.exports.tokenKey = process.env.AUTH_TOKEN_KEY

const database = mysql.createPool({
    host: databaseHost,
    user: databaseUsername,
    password: databasePassword,
    database: databaseName
})



module.exports.initDatabase = function () {
    logger.info("Authenticating to database...")

    database.query("CREATE TABLE IF NOT EXISTS `" + databaseName + "`.`" + process.env.DB_OPM_ACCOUNTS_TABLE + "` ( `id` INT NOT NULL AUTO_INCREMENT ,"
        + " `email` VARCHAR(255) NOT NULL ,"
        + " `password` TEXT NOT NULL ,"
        + " `lastname` VARCHAR(255) NOT NULL ,"
        + " `firstname` VARCHAR(255) NOT NULL ,"
        + " `isVerified` BOOLEAN NOT NULL DEFAULT FALSE ,"
        + " PRIMARY KEY (`id`)) ENGINE = InnoDB;", function (err, result) {
            if (err) {
                logger.error(err.sqlMessage)
                throw err
            }
            logger.info("Connected to database!")

        })
    database.query("CREATE TABLE IF NOT EXISTS `" + databaseName + "`.`" + process.env.DB_OPM_CREDENTIALS_TABLE + "` ( `id` INT NOT NULL AUTO_INCREMENT ,"
        + " `user_id` INT NOT NULL ,"
        + " `name` TEXT NOT NULL ,"
        + " `url` TEXT NOT NULL ,"
        + " `username` TEXT NOT NULL ,"
        + " `password` TEXT NOT NULL ,"
        + " PRIMARY KEY (`id`)) ENGINE = InnoDB;", function (err, result) {
            if (err) {
                logger.error(err.sqlMessage)
                throw err
            }
        })
}
module.exports.database = database

