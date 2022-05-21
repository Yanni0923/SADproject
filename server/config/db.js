const mysql = require("mysql");

// connect MySQL
var connection = mysql.createConnection({
    host: "database-1.c1zhpnzkx7hj.ap-northeast-1.rds.amazonaws.com",
    user: "admin",
    password: "12345678",
    database: "ntubb",
});

module.exports = connection;