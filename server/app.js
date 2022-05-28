
const express = require("express");
const db = require('./config/db');
const app = express();
const port = 7777;

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

const getList = ((rows, cname, ) => {
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

app.post('/createTeam', function (req, res) {
    const { name, school, coach } = req.body;
    db.query(
        `INSERT INTO team(name, school, coach) VALUES ('${name}', '${school}', '${coach}')`,
        function (err, rows, fields) {
            console.log(name);
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
        `INSERT INTO game(host, guest, date) VALUES ('${host}', '${guest}', '${date}')`,
        function (err, rows, fields) {
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
            console.log( team, name, position, number)
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
            return response.send({ data: teams, id:id });
        }
    )
});
app.post("/getPlayersByTeam", function (req, res) {

    db.query(
        `SELECT * FROM player WHERE team='${req.body.teamName}';`,//WHERE team='${team}'
        function (err, rows, fields) {
            players = getList(rows, 'name');
            id = getList(rows, 'player_id');
            // console.log(req.body.teamName);
            // console.log(players);
            if (rows.length === 0) {
                console.log('No player found.');
            }
            if (err) {
                error_msg = err.code + ": Server Error";
                console.log(error_msg);
                return response.send({ message: error_msg });
            };
            return res.send({ players: players, id:id });
        }
    );
});
app.post("/getGamesByTeam", function (req, res) {

    db.query(
        `SELECT * FROM game ;`,//WHERE team='${req.body.teamName}'
        function (err, rows, fields) {
            games = getList(rows, 'host');
            id = getList(rows, 'game_id');
            console.log(req.body.teamName);
            console.log(rows);
            if (rows.length === 0) {
                console.log('No player found.');
            }
            if (err) {
                error_msg = err.code + ": Server Error";
                console.log(error_msg);
                return response.send({ message: error_msg });
            };
            return res.send({ games: games, id:id });
        }
    );
});