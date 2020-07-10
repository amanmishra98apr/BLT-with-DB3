
const sql = require("mssql");
const database = process.env[process.env.Environment+'DB_NAME'];
const username = process.env[process.env.Environment+'USER_NAME'];
const password = process.env[process.env.Environment+'USER_PASSWORD'];
const server = process.env[process.env.Environment+'SERVER'];
const config = {
    user: process.env[process.env.Environment+'USER_NAME'],
    password: process.env[process.env.Environment+'USER_PASSWORD'],
    server: process.env[process.env.Environment+'SERVER'],
    database: process.env[process.env.Environment+'DB_NAME'],
    encrypt: true,
    requestTimeout: 105000
};
sql.connect(config, async function (err) {
    if (err) {
        console.log("Database Conection failed, error occured=> ", err);
    } else {
        console.log("Database connected done");
    }
});
var request = new sql.Request();
module.exports = { request };