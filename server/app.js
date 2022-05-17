/* 我要拿來接資料的檔案 */
const express = require('express');
const db = require('./config/db');
const app = express();
// const port = 7000; // your server port
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });


// app.listen(port, () => {
//     console.log(`RUN http://localhost:${port}`) // 顯示在 terminal
// });

db.query('select * from account', function (err, rows) {
    if (err) throw err;
    console.log('Response: ', rows);
});


////// 登入用：比較帳號密碼 //////
// const username__ = 'admin';
// const password__ = '12345678';
// db.query(
//     `SELECT * FROM account WHERE username='${username__}' AND password='${password__}'`,
//     function (err, rows, fields) {

//         if (rows.length === 0) {
//             console.log('ACCOUNT_NOT_EXIST');
//         };
//         console.log(rows);
//         console.log('LOGIN_SUCCESSFULLY');
//     }
// );


////// 註冊用：匯入帳號密碼 //////
// const username_ = 'test_1234';
// const password_ = '88888888';
// db.query(`INSERT INTO account(username, password) VALUES ('${username_}', '${password_}')`, function (err, rows) {
//     if (err) throw err;
//     console.log('Response: ', rows);
// });