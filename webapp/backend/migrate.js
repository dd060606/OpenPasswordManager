const db = require("./utils/database");
const CryptoJS = require("crypto-js");
require("dotenv").config();

const PASSWORD_KEY = process.env.PASSWORD_ENCRYPT_KEY
//Check if .env is valid
if (!PASSWORD_KEY) {
    console.error("Please provide a valid key for password encryption in .env !")
    process.exit(1)
}

const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

console.warn("Don't continue this script without a backup of your database!");
readline.question("Are you sure to continue? (Y/N): ", response => {
    if (response.toLowerCase() === "y") {
        db.initDatabase();
        db.database.query(`SELECT * FROM \`${process.env.DB_OPM_CREDENTIALS_TABLE}\``, function (err, result) {
            if (err) {
                console.error(err.message)
            }
            else {
                if (result.length !== 0) {
                    let alreadyMigrated = true;
                    try {
                        let password = CryptoJS.AES.decrypt(result[0].password, PASSWORD_KEY).toString(CryptoJS.enc.Utf8)
                        if (password === "") {
                            alreadyMigrated = false;
                        }
                    } catch (err) {
                        alreadyMigrated = false;
                    }
                    finally {
                        if (!alreadyMigrated) {
                            console.log("Migrating...");
                            let len = 0;

                            result.forEach(async credentials => {
                                aa = await new Promise(function (resolve, reject) {
                                    console.log("Migrating user: " + credentials.user_id + " creds_id: " + credentials.id);
                                    const updateCredentialsSQL = `UPDATE \`${process.env.DB_OPM_CREDENTIALS_TABLE}\` SET \`password\` = ? WHERE \`${process.env.DB_OPM_CREDENTIALS_TABLE}\`.\`id\` = ? AND \`${process.env.DB_OPM_CREDENTIALS_TABLE}\`.\`user_id\` = ?;`
                                    db.database.query(updateCredentialsSQL, [CryptoJS.AES.encrypt(credentials.password, PASSWORD_KEY).toString(), credentials.id, credentials.user_id], function (err, res) {
                                        if (err) {
                                            console.error("Error while migrating user: " + credentials.user_id + " creds_id: " + credentials.id);
                                            reject();
                                        }
                                        else {
                                            console.log("Migrated password:" + credentials.id)
                                            resolve();
                                        }
                                    })
                                })
                                if (len == result.length - 1) {
                                    console.log("Finished!");
                                    process.exit(0)
                                }
                                len++;
                            })

                        }
                        else {
                            console.error("Credentials are already migrated!");
                            process.exit(0);
                        }
                    }
                }
                else {
                    console.error("No credentials are stored!");
                    process.exit(0);
                }
            }

        })
        readline.close();
    }
    else {
        console.log("Aborting...");
        readline.close();
    }
});