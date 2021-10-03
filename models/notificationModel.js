const mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema({

    sender : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    receiver : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    type: {
        type: String,
        enum : ['feedback','appointment'],
    },
    content: {
        type:String
    },
    is_read: {
        type:Boolean
    },
    created_at: {
        type: Date,
        default: Date.now
    }

  });


mongoose.model('Notifications', notificationSchema);