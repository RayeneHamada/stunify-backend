require('dotenv').config();
// require models
require('./models/userModel');
require('./models/categoryModel');
require('./models/appointmentModel');
require('./models/notificationModel');
require('./models/subscriptionModel');


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

//import routes
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');
const appointmentRoute = require('./routes/appointmentRoute');
const subscriptionRoute = require('./routes/subscriptionRoute');
//use routes
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/booking', appointmentRoute);
app.use('/subscription', subscriptionRoute);
app.use(express.static(path.join(__dirname, 'public')));
module.exports = app;