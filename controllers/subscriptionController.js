  
const mongoose  = require('mongoose'),
Subscription = mongoose.model('Subscriptions');
User = mongoose.model('Users');



exports.new = function(req,res)
{
    sub = new Subscription();
    sub.name = req.body.name;
    sub.price = req.body.price;
    sub.duration = req.body.duration;
    sub.save((err,doc) => {
        if (err) {

            if (err.code === 11000)
            return res.status(500).json({message:"Subscription already exits"});
        }
        else{
            return res.status(200).send(doc);
        }
    })
}
exports.fetchAll = function(req,res)
{

    Subscription.find({}, function(err, doc) {
    
    if (err) {

      return res.status(500).json(err);
    }
    else{
        return res.status(200).send(doc);
    }
  });
  
}

exports.buySubscription = function(req,res)
{
    //si paiement verifié
        User.findById(req._id, (err, user) => {
            if (err){
                res.status(500).send(err);
            }
            else {
                user.business.subscription = req.body.subscription;
                User.updateOne({_id: req._id}, user).then(
                    () => {
                      res.status(201).json({
                        message: 'Subscription changed successfuly'
                      });
                    }
                ).catch(
                    (error) => {
                      res.status(400).json({
                        error: error
                      });
                    }
                );
            }
        })
  
}

exports.fetchAll = function(req,res)
{

    Subscription.find({}, function(err, doc) {
    
    if (err) {

      return res.status(500).json(err);
    }
    else {

        return res.status(200).send(doc);
    }
  });
  
}

exports.mySub = function (req, res) {
    Subscription.find({}).lean().exec( (err, subs) => {
        if (err) {
            return res.status(500).json(err);
        }
        else {
            User.findById(req._id, (err, user) => {
                subs.forEach((sub) => {
                    if (sub._id.equals(user.business.subscription))
                    {
                        console.log("hoy");
                        sub.owner = true;
                    }
                    else
                    {
                        sub.owner = false;
                    }
                })
                return res.status(200).send(subs);
            })
        }
    })
}

