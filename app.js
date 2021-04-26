const express = require('express');
const path = require('path');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('login');
});

const port = 3000;
app.listen(port, function(){
    console.log('Server is ready at ' + port);
});