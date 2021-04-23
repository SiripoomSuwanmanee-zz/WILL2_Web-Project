require('dotenv').config();
const express = require("express");
const path = require("path");
const { OAuth2Client } = require('google-auth-library');
const con = require('./config/db');
const session = require('express-session');
const { MemoryStore } = require('express-session');
const Memorystore = require('memorystore')(session);


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

//==== Session management ====
app.use(session({
    cookie:{ maxAge: 24*60*1000, httpOnly: true},
    store: new MemoryStore({
        checkPeriod: 24*60*60*1000
    }),
    secret: process.env.SESSION_SECRET,
    resve: true,
    saveUninitialized: false
}));
//==== Page Route ====
app.get("/", function (req, res) {
  res.render("login");
});

//==== Service ====

//Google login service
const client = new OAuth2Client(process.env.CLIENT_ID);
app.post("/verifyUser", (req, res) => {
  const token = req.body.tokenl;
  if (token) {
    client
      .verifyidToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
      })
      .then((ticket) => {
        const payload = ticket.getPayload();
        const email = payload.email;
        //verify user with DB
        const sql = 'SELECT userID, role FROM user WHERE email=?';
        //DB query
        con.query(sql,[email], (err, result) => {
            if(err){
                console.log(err);
                return res.status(500).send('Database error');
            }
            //Check whether the user is our member
            if(result.length != 1){
                return res.status(500).send('Not a member');
            }
            //Check whether the user is active
            if(result[0].role == 0){
                return res.status(500).send('Inactive member');
            }
            req.session.user = {'username': payload.name, 'userID': result[0].userID, 'role': result[0].role}; //save user data to session
            res.send("/welcome");
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send("Token is invalid");
      });
  } else {
    console.log("No token");
    res.status(400).send("No token");
  }
});

//logout
app.get('/logout', (req, res) => {
    // destroy all sessions
    req.session.destroy((err) => {
        if(err) {
            console.log(err);
        }
        res.redirect('/');
    });
});


const port = process.env.PORT;
app.listen(port, function () {
  console.log("Server is ready at " + port);
});
