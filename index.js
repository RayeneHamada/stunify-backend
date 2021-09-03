require('dotenv').config();
// require models
require('./models/userModel');
require('./models/categoryModel');


require('./config/dbConfig');

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');







const passport = require('passport');

const app = express();
app.use(cors());
app.use(passport.initialize())
app.use(bodyParser.urlencoded({ extended: false }))

 
app.use(bodyParser.json());
app.use(express.static('ressources'));

//import routes
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');
//use routes
app.use('/user', userRoute);
app.use('/category', categoryRoute);


module.exports = app;