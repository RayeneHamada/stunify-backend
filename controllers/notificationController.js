  
const mongoose  = require('mongoose'),
Subscription = mongoose.model('Subscriptions');
User = mongoose.model('Users');
Notification = mongoose.model('Notifications');




exports.fetchAll = function(req,res)
{

    Subscription.find({ receiver: req._id }).
    populate({ path: 'sender', select: 'firstName' }).
    populate({path: 'sender', select:'lastName'}).
    populate({path: 'sender', select:'profile_image'}).
        exec((err, doc) => {
    
    if (err) {

      return res.status(500).json(err);
    }
    else{
        return res.status(200).send(doc);
    }
  });
  
}
