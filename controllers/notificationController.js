
const mongoose = require('mongoose'),
      Subscription = mongoose.model('Subscriptions');
User = mongoose.model('Users');
Notification = mongoose.model('Notifications');


exports.sendNotification = async (notification) => {
  try {
    await notification.save();
    let socketUser = WebSockets.getSocketId(notification.receiver+"");

    if(socketUser)
    {
      global.io.sockets.to(socketUser.socketId).emit('notification', notification);
    }
  }
  catch (err) {
    console.log('err' + err);
  }
}


exports.fetchAll = function (req, res) {

  Notification.find({ receiver: req._id }).
    populate({ path: 'sender', select: 'firstName' }).
    populate({ path: 'sender', select: 'lastName' }).
    populate({ path: 'sender', select: 'business.businessName' }).
    populate({ path: 'sender', select: 'profile_image' }).
    exec((err, doc) => {

      if (err) {

        return res.status(500).json(err);
      }
      else {
        return res.status(200).send(doc);
      }
    });

}


