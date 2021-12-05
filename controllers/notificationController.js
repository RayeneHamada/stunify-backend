  
const mongoose  = require('mongoose'),
Subscription = mongoose.model('Subscriptions');
User = mongoose.model('Users');
Notification = mongoose.model('Notifications');




exports.fetchAll = function(req,res)
{

    Notification.find({ receiver: req._id }).
    populate({ path: 'sender', select: 'firstName' }).
    populate({path: 'sender', select:'lastName'}).
    populate({path: 'sender', select:'business.businessName'}).
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

exports.fetchAll = function(req,res)
{

    Notification.find({ receiver: req._id }, '_id created_at sender type content created_at').
    populate({ path: 'sender', select:'businessName firstName lastName profile_image' }).
        exec((err, doc) => {
    
    if (err) {

      return res.status(500).json(err);
    }
    else{
        return res.status(200).send(doc);
    }
  });
  
}

