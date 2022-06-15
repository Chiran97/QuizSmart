var mysql = require('mysql');
require('dotenv').config()

var dbConnection = mysql.createConnection({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // port: 3306,
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: 3306,
    ssl: false,
    multipleStatements: true,
    connectTimeout: 120000
})

console.log(process.env);

dbConnection.connect(function (err) {
    if (!err){
        console.log("Database Connection Created");
    }
    else{
        console.log(err);
        console.log("Database Connection not Created");
    }
});

module.exports = dbConnection;