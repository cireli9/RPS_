const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const body_parser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(body_parser.json());

//used to bypass cors no-cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", function(req, res) {
  console.log("request was made: " + req.url);
  res.render("index", { ip: req.ip });
});

app.get("/favicon.ico", function(req, res) {
  res.sendFile(__dirname + "/favicon_io/favicon.ico");
});
app.get("/styles.css", function(req, res) {
  res.sendFile(__dirname + "/styles.css");
});
app.get("/app.js", function(req, res) {
  console.log("request to app made");
  res.sendFile(__dirname + "/app.js");
});
app.get("/images/rock.png", function(req, res) {
  res.sendFile(__dirname + "/images/rock.png");
});
app.get("/images/scissors.png", function(req, res) {
  res.sendFile(__dirname + "/images/scissors.png");
});
app.get("/images/paper.png", function(req, res) {
  res.sendFile(__dirname + "/images/paper.png");
});

// app.post("/ip/:foo", function(req, res) {
//   console.log(req.params.foo);
//   // const {ip} = req.body;
//   //console.log(ip);
//   res.send("foo");
// });

app.post("/ip/", function(req, res) {
  console.log(req.body);
  //sql reference to database using ip address from req.body
  //create database object and connect
  var db = new sqlite3.Database('./rps.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
      return console.error(err.message);
      }
      console.log('Connected to the SQlite database.');
  });

  var store_data = `INSERT INTO ip_rps (ip, rock, paper, scissors)
                      VALUES(?, 0, 0, 0) 
                      ON CONFLICT(ip) 
                      DO UPDATE SET`;
  //change store_data sql query based on request
  switch (req.body.choice) {
    case "Rock":
      store_data = store_data + " Rock = Rock+1";
      break;
    case "Paper":
      store_data = store_data + " Paper = Paper+1";
      break;
    case "Scissors":
      store_data = store_data + " Scissors = Scissors+1";
      break;
  }
  const get_data = `SELECT rock, paper, scissors FROM ip_rps WHERE IP = ?`;

  db.serialize(() => {
    // Queries scheduled here will be serialized.
    db.run(store_data, [req.body.ip])
      .each(get_data, [req.body.ip], (err, row) => {
        if(err) {
          throw err;
        }
        res.send({Rock: row.Rock, Paper: row.Paper, Scissors: row.Scissors});
      })
  });
  // db.all(store_data, [req.choice, req.choice, req.ip], (err, rows) => {
  //     if (err) {
  //         throw err;
  //     }
  //     rows.forEach((row) => {
  //         console.log(row.Rock + row.Scissors);
  //     });
  // });


  // close the database connection
  db.close((err) => {
      if (err) {
      return console.error(err.message);
      }
      console.log('Close the database connection.');
  });
});

app.listen(3002);
