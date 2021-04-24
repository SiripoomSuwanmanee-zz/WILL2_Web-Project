const express = require('express');
const path = require('path');
const app = express();
const upload = require("./uploadConfig");
//set upload directory and input fieldname

//  ============= mysql  =============
const mysql = require("mysql");
const config = require("../../dbConfig");
const con = mysql.createConnection(config);

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "login.ejs"));
});

app.get("/admin login", function(req, res){
    res.sendFile(path.join(__dirname, ("login_ui.html")));
});

app.get("/admin inventory", function(req, res){
    res.sendFile(path.join(__dirname, "Admin's resource list.html"));
});

app.get("/admin history", function(req, res){
    res.sendFile(path.join(__dirname, "resource payment history .html"));
});

app.get("/admin list of resource was out", function(req, res){
    res.sendFile(path.join(__dirname, "payment list.html"));
});

app.get("/admin statistics", function(req, res){
    res.sendFile(path.join(__dirname, "statistics.html"));
});

app.get("/user request list", function(req, res){
    res.sendFile(path.join(__dirname, "request list.html"));
});

app.get("/user payment list", function(req, res){
    res.sendFile(path.join(__dirname, "payment list.html"));
});

app.get("/user resouce list", function(req, res){
    res.sendFile(path.join(__dirname, "User's resouce list.html"));
});

app.get("/user withdrawal list", function(req, res){
    res.sendFile(path.join(__dirname, "withdrawal list.html"));
});

app.get("/advisor payment", function(req, res){
    res.sendFile(path.join(__dirname, "payment lsit.html"));
});

app.get("/advisor resource list", function(req, res){
    res.sendFile(path.join(__dirname, "resource list.html"));
});

app.get("/advisor resource payment history", function(req, res){
    res.sendFile(path.join(__dirname, "resource payment history.html"));
});

app.get("/superadmin login", function(req, res){
    res.sendFile(path.join(__dirname, "login_ui.html"));
});

app.get("/superadmin manage_user", function(req, res){
    res.sendFile(path.join(__dirname, "manage_user.html"));
});

// ----- Get User -----
app.get("/user", function(req, res){
    const sql = "SELECT User_Email FROM user";
    con.query(sql, function(err, result){
        if(err){
            console.log(err);
            res.status(500).send("Database server error");
        }
        else{
            con.connect(function(err) {
                if (err) throw err;
                con.query(sql, function (err, result, fields) {
                  if (err) throw err;
                  console.log(result);
                });
              });
        }
    })
});

// ----- Get Resource -----
app.get("/resource", function(req, res){
    const sql = "SELECT Resource_ID FROM resource";
    con.query(sql, function(err, result){
        if(err){
            console.log(err);
            res.status(500).send("Database server error");
        }
        else{
            con.connect(function(err) {
                if (err) throw err;
                con.query(sql, function (err, result, fields) {
                  if (err) throw err;
                  console.log(result);
                });
              });
        }
    })
});

// ----- Get Request -----
app.get("/request", function(req, res){
    const sql = "SELECT Request_ID FROM request";
    con.query(sql, function(err, result){
        if(err){
            console.log(err);
            res.status(500).send("Database server error");
        }
        else{
            con.connect(function(err) {
                if (err) throw err;
                con.query(sql, function (err, result, fields) {
                  if (err) throw err;
                  console.log(result);
                });
              });
        }
    })
});


const port = 3000;
app.listen(port, function(){
    console.log('Server is ready at ' + port);
});