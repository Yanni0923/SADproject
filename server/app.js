
const express = require("express");
const db = require('./config/db');
const app = express();
const port = 7777;
db.connect();
db.query('SELECT 12 + 34 AS result', function(err, rows, fields) {
    if (err) throw err;
    console.log('連線成功');
}); 
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.listen(port, () => {
    console.log(`RUN http://localhost:${port}`);
});

// TODO:
// - Game:
// - - foreign key: id required
// - - date format

const getList = ((rows, cname,) => {
    // get list of values of a column from RowDataPacket
    obj = JSON.parse(JSON.stringify(rows));
    values = [];
    for (let i = 0; i < obj.length; i++) {
        values.push(obj[i][cname]);
    }
    return values;
});


app.post("/signin", function (req, res) {
    const { username, password } = req.body;
    if (username != "" && password != "") {
        db.query(
            `SELECT * FROM account WHERE username='${username}' AND password='${password}'`,
            function (err, rows, fields) {
                console.log(getList(rows, 'username'));
                if (rows.length === 0) {
                    console.log('ACCOUNT_NOT_EXIST');
                    return res.send({ message: 'ACCOUNT_NOT_EXIST' });
                };
                console.log('LOGIN_SUCCESSFULLY');
                return res.send({ message: 'LOGIN_SUCCESSFULLY' });
            }
        );
    }
});

app.post("/signup", function (req, res) {
    const { username, password, confirm_password } = req.body;
    if (username != "" && password != "" && confirm_password != "") {
        db.query(
            `INSERT INTO account(username, password) VALUES ('${username}', '${password}')`,
            function (err, rows, fields) {
                if (err) {
                    console.log(err.code);
                    return res.send({ message: "ACCOUNT_ALREADY_EXISTS" });
                };

                if (password !== confirm_password) {
                    return res.send({ message: "兩次密碼輸入不一致！" });
                } else {
                    console.log("REGISTER_SUCCESSFULLY");
                    return res.send({ message: "REGISTER_SUCCESSFULLY" });
                }
            }
        );
    }
});

app.post('/createTeam', function (req, res) {
    const { name, school, coach } = req.body;
    db.query(
        `INSERT INTO team(team_name, school, coach) VALUES ('${name}', '${school}', '${coach}')`,
        function (err, rows, fields) {
            console.log(school);
            if (err) {
                error_msg = err.code + ": Server Error";
                console.log(error_msg);
                return res.send({ message: error_msg });
            };
            success_msg = "Created team: " + name;
            return res.send({ message: success_msg });
        }
    )
});
app.post('/createGame', function (req, res) {
    const { host, guest, date } = req.body;
    db.query(
        `INSERT INTO game(host, guest, date, highlights) VALUES (${host}, ${guest}, '${date}', '')`,
        
        function (err, rows, fields) {
            console.log(req.body);
            if (err) {
                error_msg = err.code + ": Server Error";
                console.log(error_msg);
                return res.send({ message: error_msg });
            };
            success_msg = "Created game";
            return res.send({ message: success_msg });
        }
    )
});
app.post('/createPlayer', function (req, res) {
    const { team, name, position, number } = req.body;
    db.query(
        `INSERT INTO player( team, name, position, number, hand, height, weight) VALUES ('政治大學', '歐', 'C',23, 'right', 189, 90)`,
        function (err, rows, fields) {
            console.log(team, name, position, number)
            if (err) {
                error_msg = err.code + ": Server Error";
                console.log(error_msg);
                return res.send({ message: error_msg });
            };
            success_msg = "Created player: " + name;
            return res.send({ message: success_msg });
        }
    )
});

app.get('/getTeams', (request, response) => {
    db.query(
        `SELECT * FROM team`,
        function (err, rows, fields) {
            teams = getList(rows, 'name');
            id = getList(rows, 'team_id');
            console.log(teams);
            if (rows.length === 0) {
                console.log('No teams found.')
            }
            if (err) {
                error_msg = err.code + ": Server Error";
                console.log(error_msg);
                return response.send({ message: error_msg });
            };
            return response.send({ data: teams, id: id });
        }
    )
});
app.post("/getPlayersByTeam", function (req, res) {

    db.query(
        `SELECT * FROM player WHERE team='${req.body.teamName}';`,//WHERE team='${team}'
        function (err, rows, fields) {
            players = getList(rows, 'name');
            id = getList(rows, 'player_id');
            console.log(req.body.teamName);
            console.log(players);
            if (rows.length === 0) {
                console.log('No player found.');
            }
            if (err) {
                error_msg = err.code + ": Server Error";
                console.log(error_msg);
                return response.send({ message: error_msg });
            };
            return res.send({ players: players, id: id });
        }
    );
});
app.post("/getGamesByTeam", function (req, res) {

    db.query(
        `SELECT * FROM game WHERE host = ${req.body.teamName} OR guest  = ${req.body.teamName};`,//WHERE host = ${req.body.teamName} OR guest  = ${req.body.teamName}
        function (err, rows, fields) {
            console.log(req.body.teamName);
            console.log(rows);
            host = getList(rows, 'host');
            guest = getList(rows, 'guest');
            
            id = getList(rows, 'game_id');
            
            if (rows.length === 0) {
                console.log('No game found.');
            }
            if (err) {
                error_msg = err.code + ": Server Error";
                console.log(error_msg);
                return response.send({ message: error_msg });
            };
            return res.send({host: host, guest: guest, id: id });
        }
    );
});
app.post('/createPlay', function (req, res) {
    db.query(
        `INSERT INTO play(player_id, game_id, type, finish, result, free_throw) VALUES (${req.body.player_id}, ${req.body.game_id}, '${req.body.type}', '${req.body.finish}', '${req.body.result}', '${req.body.free_throw}')`,
        function (err, rows, fields) {
            console.log(req.body);
            if (err) {
                error_msg = err.code + ": Server Error";
                console.log(error_msg);
                return res.send({ message: error_msg });
            };
            success_msg = "Created play successfully ";
            return res.send({ message: success_msg });
        }
    )
});

//  Query Modify Screen.js
app.get('/getGamesQuery', (request, response) => {
    db.query(
        `SELECT * FROM game`,
        function (err, rows) {
            console.log(rows);
            return response.send({ data: rows });
        }
    )
});


app.get('/getTeamsQuery', (request, response) => {
    db.query(
        `SELECT * FROM team`,
        function (err, rows) {
            console.log(rows);
            return response.send({ data: rows });
        }
    )
});

app.get('/getPlayersQuery', (request, response) => {
    db.query(
        `SELECT * FROM player`,
        function (err, rows) {
            console.log(rows);
            return response.send({ data: rows });
        }
    )
});



// 匯出情蒐報表的 search

app.post('/searchTeam', function (request, response) {
    const { team_name } = request.body;
    db.query(
        `SELECT P.game_id, Pr.team, Pr.name, P.type, P.finish, P.result, P.free_throw
        FROM ntubb.play as P, ntubb.player as Pr, ntubb.team as T
        WHERE P.player_id = Pr.player_id and Pr.team = T.name and T.name = '${team_name}'`,
        function (err, rows, fields) {
            if (rows.length === 0) {
                console.log('查無球隊資料，請檢察拼字是否正確');
            }
            if (err) {
                error_msg = err.code + ": Server Error";
                console.log(error_msg);
                return response.send({ message: error_msg });
            };
            obj = JSON.parse(JSON.stringify(rows));
            values = [];
            for (let i = 0; i < obj.length; i++) {
                values.push(obj[i]);
            }
            return response.send({ data: values });
        }
    );
});


app.post('/searchPlayer', function (request, response) {
    const { team_name, player_name } = request.body;
    db.query(
        `SELECT P.game_id, Pr.team, Pr.name, P.type, P.finish, P.result, P.free_throw
        FROM ntubb.play as P, ntubb.player as Pr, ntubb.team as T
        WHERE P.player_id = Pr.player_id and Pr.team = T.name and T.name = '${team_name}' and Pr.name = '${player_name}'`,
        function (err, rows, fields) {
            if (rows.length === 0) {
                console.log('No data found.')
                // console.log(team_name)
                // console.log(player_name)
            }
            if (err) {
                error_msg = err.code + ": Server Error";
                console.log(error_msg);
                return response.send({ message: error_msg });
            };
            obj = JSON.parse(JSON.stringify(rows));
            values = [];
            for (let i = 0; i < obj.length; i++) {
                values.push(obj[i]);
            }
            return response.send({ data: values });
        }
    );
});