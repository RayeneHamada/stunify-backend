require('dotenv').config();
// require models
require('./models/userModel');


require('./config/dbConfig');

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');



//import routes
const userRoute = require('./routes/userRoute');



const passport = require('passport');

const app = express();
app.use(cors());
app.use(passport.initialize())
app.use(bodyParser.urlencoded({ extended: false }))

 
app.use(bodyParser.json());

//use routes
app.use('/user', userRoute);


app.get('/test', (req,res) => { return res.json({ahla:'ahla'}) });


module.exports = app;