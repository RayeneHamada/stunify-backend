const mongoose = require('mongoose');
var subscriptionSchema = new mongoose.Schema({

    name: {
        type: String,
        unique:true,
    },
    // in months
    duration : {
        type: Number,
        unique:true,
    },
    price: {
        type: Number
    }
  });


mongoose.model('Subscriptions', subscriptionSchema);