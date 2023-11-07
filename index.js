
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: '    djalal ',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static('public'));


const server = app.listen(3001, () => {
    const host = '127.0.0.1';
    const port = server.address().port;
    console.log(`Server running on http://${host}:${port}`);
});

const io = new Server(server);

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'websocket'
});


app.set('view engine', 'ejs');


app.get('/', (req, res) => {

    res.redirect('/user');

});




app.get('/user', (req, res) => {
    if (req.session.user) {

        const user = req.session.user;


        res.render('user', { user: user });
    } else {

        res.render('login');
    }
});

app.post("/login", (req, res) => {
    const phone = req.body.phone;
    const password = req.body.password;
    console.log(password, phone)
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        con.query('SELECT * FROM users WHERE phone=? and password=?', [phone, password], function (error, results, fields) {
            if (error) throw error;

            if (results.length == 1) {


                req.session.user = results[0];
                console.log(req.session.user);
                // توجيه المتصفح إلى صفحة المحادثة
                res.redirect('/user');

                console.log("ok done")


            }





        });
    })
})


app.get("/users", (req, res) => {
    const excludedUserId = req.query.excludedUserId;

    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");

        const query = "SELECT * FROM users WHERE id <> ?";
        con.query(query, [excludedUserId], function (error, results, fields) {
            if (error) throw error;


            res.status(200).json(results);
        });
    });
});
