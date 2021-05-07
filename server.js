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



app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, ("/login_ui.html")));
});

app.get("/admin inventory", function(req, res){
    res.sendFile(path.join(__dirname, "คลังวัสดุAdmin.html"));
});

app.get("/admin history", function(req, res){
    res.sendFile(path.join(__dirname, "ประวัติจ่ายวัสดุ.html"));
});

app.get("/admin list of resource was out", function(req, res){
    res.sendFile(path.join(__dirname, "รายการจ่ายวัสดุ.html"));
});

app.get("/admin statistics", function(req, res){
    res.sendFile(path.join(__dirname, "สถิติ.html"));
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
            res.json(result);
        }
    })
});

app.get("/resource", function(req, res){
    const sql = "SELECT Resource_ID FROM resource";
    con.query(sql, function(err, result){
        if(err){
            console.log(err);
            res.status(500).send("Database server error");
        }
        else{
            res.json(result);
        }
    })
});

app.get("/request", function(req, res){
    const sql = "SELECT Request_ID FROM request";
    con.query(sql, function(err, result){
        if(err){
            console.log(err);
            res.status(500).send("Database server error");
        }
        else{
            res.json(result);
        }
    })
});

const port = 3000;
app.listen(port, function(){
    console.log('Server is ready at ' + port);
});