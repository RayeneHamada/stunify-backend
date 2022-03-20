const mongoose = require('mongoose');
var subscriptionSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plans"
    },
    subscriptionId: {
        type: String
    },
    state: {
        type: String,
        default: 'unpaid'
    }
});


mongoose.model('Subscriptions', subscriptionSchema);