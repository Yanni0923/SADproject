const mysql = require("mysql");

// connect MySQL
var connection = mysql.createConnection({
    host: "ntu-basketball.cmwubheuoe2k.ap-northeast-1.rds.amazonaws.com",
    user: "admin",
    password: "11111111",
    database: "ntu_basketball",
    port:3306,
});

module.exports = connection;