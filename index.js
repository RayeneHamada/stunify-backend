require('dotenv').config();
// require models
require('./models/userModel');
require('./models/prestationModel');
require('./models/categoryModel');
require('./models/appointmentModel');
require('./models/notificationModel');
require('./models/subscriptionModel');
require('./models/planModel');


require('./config/dbConfig');

const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');
const socketio = require("socket.io");






const passport = require('passport');

const app = express();
app.use(cors());
app.use(passport.initialize())
app.use(bodyParser.urlencoded({ extended: false }))

 
app.use(bodyParser.json());

//import utils
const WebSockets = require("./utils/WebSockets.js");

//import routes
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');
const appointmentRoute = require('./routes/appointmentRoute');
const subscriptionRoute = require('./routes/subscriptionRoute');
const planRoute = require('./routes/planRoute');
const notificationRoute = require('./routes/notificationRoute');
const stripeRoute = require('./routes/stripeRoute');
//use routes
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/booking', appointmentRoute);
app.use('/subscription', subscriptionRoute);
app.use('/plan', planRoute);
app.use('/notification', notificationRoute);
app.use('/stripe', stripeRoute);
app.use(express.static(path.join(__dirname, 'public')));

/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
    return res.status(404).json({
      success: false,
      message: 'API endpoint doesnt exist'
    })
});
  
/** Create HTTP server. */
const server = http.createServer(app);
/** Create socket connection */
global.WebSockets = WebSockets;
global.io = socketio(server);
global.io.on('connection', WebSockets.connection);

/** Listen on provided port, on all network interfaces. */
server.listen(process.env.PORT);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log('it works')
});