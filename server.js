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

app.get("/admin", function(req, res){
    res.sendFile(path.join(__dirname, ("login(admin).ejs")));
});

app.get("/admin inventory", function(req, res){
    res.sendFile(path.join(__dirname, "คลังวัสดุadmin.html"));
});

app.get("/admin request", function(res, req){
    res.sendFile(path.join(__dirname, "รายการคำสั่งเบิก.html"));
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