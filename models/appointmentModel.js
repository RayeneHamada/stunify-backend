const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var appointmentSchema = new mongoose.Schema({

        personal : {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users"
        },
        business : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
        },
        start_date_time: {
            type: Date,
        },
        end_date_time: {
            type: Date,
        },
        duration: {
            type: Number,
        },
        prestation : {
            type:String
        },
        price : {
            type:Number
        },
        duration : {
            type:Number
        },
        payment_status : {
            type:String
        },
        status : {
            type:String
        },

  });


mongoose.model('Appointments', appointmentSchema);