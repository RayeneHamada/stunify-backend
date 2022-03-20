const mongoose = require('mongoose');
var planSchema = new mongoose.Schema({

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
    },
    priceId:{
        type:String
    }
  });


mongoose.model('Plans', planSchema);