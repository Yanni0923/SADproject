const express = require("express");
const db = require('./config/db');
const app = express();
const port = 7000;

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.listen(port, () => {
    console.log(`RUN http://localhost:${port}`);
});

app.post("/signin", function (req, res) {
    const { username, password } = req.body;
    db.query(
        `SELECT * FROM account WHERE username='${username}' AND password='${password}'`,
        function (err, rows, fields) {
            console.log(rows);
            if (rows.length === 0) {
                console.log('ACCOUNT_NOT_EXIST');
                return res.send({ message: 'ACCOUNT_NOT_EXIST' });
            };
            console.log('LOGIN_SUCCESSFULLY');
            return res.send({ message: 'LOGIN_SUCCESSFULLY' });
        }
    );
});

app.post("/signup", function (req, res) {
    const { username, password, confirm_password } = req.body;
    db.query(
        `INSERT INTO account(username, password) VALUES ('${username}', '${password}')`,
        function (err, rows, fields) {
            if (err) {
                console.log(err.code);
                return res.send({ message: "ACCOUNT_ALREADY_EXISTS" });
            };
            console.log("REGISTER_SUCCESSFULLY");
            return res.send({ message: "REGISTER_SUCCESSFULLY" });
        }
    );
});
