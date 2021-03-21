const express = require("express");
const path = require("path");
const app = express();

// ===== mysql =====
const mysql = require("mysql");
const config = require("./dbConfig.js");
const con = mysql.createConnection(config);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// ====== Page route ======
// ====== Root service ======

app.get("/admin" ,function(req,res){
    res.sendFile(path.join(__dirname, "/views/admin.html"));
});

app.get("/user" ,function(req,res){
    res.sendFile(path.join(__dirname, "/views/user.html"));
});

// ====== Other route ======
app.post("/login",function(req,res){
    const {username,password} = req.body;
    const sql = `SELECT username, role FROM user WHERE username ='${username}' AND password='${password}'`;
    con.query(sql, function(err,result,field){
        if(err){
            console.log(err);
        res.status(500).send("Database server error");
        }
        else{
            if(result.length == 0 ){
                res.status(400).send("Wrong username or password");
            }
            else{
                // correct login
                // res.send("welcome");
                if(result[0].role == 1){
                    res.send("admin");
                }
                else {
                    res.send("user");
                }
            }
        }
        
    });
});

// ====== Get all users ======
app.get("/user", function(req, res){
    const sql = "SELECT id, username, role FROM user";
    con.query(sql, function(err,result){
        if(err){
            console.log(err);
            res.status(500).send("Database server error");
        }
        else{
            res.json(result);
        }
    });
});

// ====== Delete User ======
app.delete("/user/:id", function(req,res){
    const id = req.params.id;
    const sql = "DELETE FROM user WHERE id=?";
    con.query(sql,[id],function(err,result){
        if(err){
            console.log(err);
            res.status(500).send("Database server error");
        }
        else{
            if(result.affectedRows == 1){
                res.send("Delete done");
            }
            else{
                res.status(500).send("Delete error");
            }
        }
    });
});

// ====== Starting server ======
const PORT = 3000;
app.listen(PORT, (req , res) =>{
    console.log("Server is running at " + PORT);
});