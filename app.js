require("dotenv").config();
const express = require("express");
const path = require("path");
const { OAuth2Client } = require("google-auth-library");
const db = require("./config/db");
const session = require("express-session");
const { MemoryStore } = require("express-session");
const Memorystore = require("memorystore")(session);
const checkUser = require('./checkUser');
const { database } = require("d:/saloon pj/projectsaloon/config/dbconfig");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

//==== Session management ====
app.use(session({
  cookie: { maxAge: 24*60*60*1000, httpOnly: true },
  store: new MemoryStore({
      checkPeriod: 24*60*60*1000
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false
}));

//==== Page Route ====
app.get("/", (req, res) => {
  if(req.session.user) {
    res.redirect('/welcome');
}
else {
    res.render('login');
}
});

app.get('/welcome', checkUser, (req, res) => {
  res.render('welcome', {user: req.session.user});
});

//============ Google login service ================
const client = new OAuth2Client(process.env.CLIENT_ID);
app.post("/verifyUser", (req, res) => {
  const token = req.body.token;
  if (token) {
    client
      .verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
      })
      .then((ticket) => {
        const payload = ticket.getPayload();
        const email = payload.email;
        //==================== verify user with DB ====================
        const sql =
          "SELECT User_ID, User_Email, User_Role, User_status FROM user WHERE User_Email=?";
        //DB query
        db.query(sql, [email], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Database error");
          }
          //Check whether the user is our member
          if (result.length != 1) {
            return res.status(500).send("Not a member");
          }
          //Check whether the user is active
          if (result[0].status == 0) {
            return res.status(500).send("Inactive member");
          }
          //check user role
          if (result[0].User_Role == 1) {
            req.session.user = {
              username: payload.name,
              userID: result[0].User_ID,
              role: result[0].User_Role,
              status: result[0].User_status,
            }; //save user data to session
            res.send("/welcome");
          }
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
app.get("/logout", (req, res) => {
  // destroy all sessions
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

//==== Service ====

//================================ USER service ================================
app.get('/getResourcelist', (req, res)=>{
  const sql="SELECT Resource_ID,	Resource_Name,	Amount_Remain,	Unit FROM resource"
  db.query(sql, (err,result) =>{
    
    if (err) {
      //console.log(err)
     return res.status(500).send("DB server error");
    } 
    
    res.json(result);
  
  });
});

//insert request into db *not done yet*
app.post('/SendRequestDetail', (req, res)=> {
  let detail = req.body;
  console.log(detail);
  
  const sql ="INSERT INTO request(`User_User_ID`, `Request_Reason`, `Request_status`) VALUES (?,?,0)" //not done yet
  db.query(sql,[detail.userID, detail.reason], (err, result)=>{
    console.log("Inserting requst into DB...")
    if (err) {
      //console.log(err)
     return res.status(500).send("DB server error");
    };
    if(result.affectedRows != 1) {
      return res.status(500).send("Send request Failed");
    };
    insertRequestDetail(result.insertId, detail); //insert into Request detail table
    res.send('Your request has been sent');
  });
//TODO : complete insertRequestDetail function
 function insertRequestDetail(requestId, detailList){
  console.log(detailList);
  const sql = "INSERT INTO RequestINSERT INTO `request detail`(`Request_User_User_ID`, `Request_Request_ID`, `Resource_Resource_ID`, `Resource_quantity`) VALUES (?,?,?,?)"
  for(i in detailList.resourceID){
    db.query(sql, [detailList.userID, requestId, detailList.resourceID[i], detailList.amount[i]],(err, result)=>{
      if (err) {
        //console.log(err)
       return res.status(500).send("DB server error");
      };
      if(result.affectedRows != 1) {
        return res.status(500).send("Send request Failed");
      };
    });
  }
  }
});

//get request history for specific user
app.get('/requestHistory', (req,res)=>{
  let userId = req.body;
  const sql=`SELECT rq.Request_ID, rq.User_User_ID, rq.Request_Reason, rq.Request_status, rq.Request_Date, rd.Resource_quantity
  FROM request rq JOIN requestdetail rd
  ON rq.User_User_ID = rd.User_User_ID
  WHERE rq.User_User_ID = ?`
  db.query(sql, [userId],(err,result) =>{
    
    if (err) {
      //console.log(err)
     return res.status(500).send("DB server error");
    } 
    console.log(result);
    //res.json(result);
  });
});

app.get('/superadmin', (req, res)=>{
  const sql = "SELECT User_ID, User_Email, User_NAME, User_Role, Add_date FROM user"
  db.query(sql, (err, result)=>{
    if (err) {
      //console.log(err)
     return res.status(500).send("DB server error");
    }
    else{
      res.json(result);
    }
  });
});

app.get('/advisor', (req, res)=>{
  const sql = "SELECT User_ID, User_Email, User_NAME, User_Role, Add_date FROM user"
  db.query(sql, (err, result)=>{
    if (err) {
      //console.log(err)
     return res.status(500).send("DB server error");
    }
    else{
      res.json(result);
    }
  });
});



//============== PORT ==============
const port = process.env.PORT;
app.listen(port, function () {
  console.log("Server is ready at " + port);
});
