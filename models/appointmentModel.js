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
        prestation : {
            type:String
        },
        payment_status : {
            type:String
        },
        status : {
            type:String
        },

  });


mongoose.model('Appointments', appointmentSchema);