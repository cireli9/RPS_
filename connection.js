const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.set('view engine', "ejs");

app.get("/", function(req, res){
    console.log("request was made: " + req.url);
    //create database object and connect
    var db = new sqlite3.Database('./rps.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
        return console.error(err.message);
        }
        console.log('Connected to the SQlite database.');
    });
    
    const sql = `IF EXISTS (SELECT * FROM ip_rps WHERE IP=?)
                SELECT * FROM ip_rps WHERE IP = ?
                ELSE
                INSERT INTO ip_rps VALUES (?, 0, 0, 0)`;
    db.all(sql, [req.ip], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row.IP);
        });
    });

    // close the database connection
    db.close((err) => {
        if (err) {
        return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
    res.render('index', {ip: req.ip});
});

app.get("/favicon.ico", function(req, res){ res.sendFile(__dirname + '/favicon_io/favicon.ico')});
app.get("/styles.css", function(req, res){ res.sendFile(__dirname + '/styles.css')});
app.get("/app.js", function(req, res){
    console.log('request to app made');
    res.sendFile(__dirname + '/app.js')
});
app.get("/images/rock.png", function(req, res){ res.sendFile(__dirname + '/images/rock.png')});
app.get("/images/scissors.png", function(req, res){ res.sendFile(__dirname + '/images/scissors.png')});
app.get("/images/paper.png", function(req, res){ res.sendFile(__dirname + '/images/paper.png')});

app.listen(3000);