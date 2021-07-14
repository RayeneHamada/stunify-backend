  
const mongoose = require('mongoose'),
    User = mongoose.model('Users');
const passport = require('passport');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { upperFirst } = require('lodash');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.SERVICE_SID;
const client = require('twilio')(accountSid, authToken);

exports.sendCode = function(req,res,next)
{
    client.verify.services(serviceSid)
             .verifications
             .create({to: req.body.phoneNumber, channel: 'sms'})
      .then(verification => {
        if (verification.status == "pending") {


          User.exists({ phoneNumber: req.body.phoneNumber}, function (err, exist) {
            if (err) {
              res.send(err);
            }
            else {
              // si le compte est activé
              if (exist) {
                return   res.status(200).json({sms_state:"sms sent correctly" });
                
              }
              else {
                var user = new User();
                  user.phoneNumber = req.body.phoneNumber;
                  user.save((err, doc) => {  
                    if (!err)
                       {    
                        return   res.status(200).json({sms_state:"sms sent correctly" });
                        }
                });
              }
            }
          });
          
        }
      })
            .catch(error => console.log(error));

}

exports.verifCode = function(req,res,next)
{
  console.log('verification now');

  User.exists({ phoneNumber: req.body.phoneNumber, activated: true }, function (err, exist) {
    if(err){
      res.send(err);
    }
    else {
      // si le compte est activé
      if (exist)
      {
        client.verify.services(serviceSid)
             .verificationChecks
             .create({to: req.body.phoneNumber, code: req.body.code})
             .then(verification_check => {
               if (verification_check.status == "approved")
               {
                User.findOne({ phoneNumber: req.body.phoneNumber },
                  (err, user) => {
                      if (!user)
                          return res.status(404).json({ status: false, message: 'User record not found.' });
                      else
                          {
                          res.json({ operatiton: "login", verified: true,"token": user.generateJwt() });
                            
                          }
                  });
                }
              else
                 res.json({ operatiton: "login", verified: false });
             })
            .catch(error => console.log(error));
      }
      // si le compte n'est pas activé
      else {
        client.verify.services(serviceSid)
          .verificationChecks
          .create({ to: req.body.phoneNumber, code: req.body.code })
          .then(verification_check => {
            if (verification_check.status == "approved") {

              User.findOne({ phoneNumber: req.body.phoneNumber },
                (err, user) => {
                    if (!user)
                        return res.status(404).json({ message: 'User record not found.' });
                    else
                        {
                          user.activated = true;
                          User.updateOne({phoneNumber: user.phoneNumber}, user).then(
                            () => {
                              res.json({ operatiton: "signup", verified: true,"token": user.generateJwt() });
                            }
                          ).catch(
                            (error) => {
                              res.status(400).json({
                                error: error
                              });
                            }
                          );
                        }
                });
            }     
              else
              res.json({ operatiton: "signup", verified: false });
            })
            .catch(error => res.json({ operatiton: "signup", verified: false }));
      }
    }

  })
}
exports.completeSubscription = function(req,res)
{
    var user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
  


}