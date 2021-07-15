  
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




exports.signup = function(req,res,next)
{
        var user = new User();
        user.fullName = req.body.fullName;
        user.email = req.body.email;
        user.password = req.body.password;


            user.save((err, doc) => {  
              if (!err)
                 {                     
                     res.status(200).json({ "message": "User created successfully" });
                  }
              else {
                  if (err.code == 11000)
                      res.status(422).send(['Duplicate email adrress found.']);
                  else
                      return next(err);
              }
      
          });    
}

exports.businessSignup = function(req,res,next)
{
          User.findOne({email: req.body.email },
            (err, user) => {
                if (!user)
                    return res.status(404).json({ message: 'User record not found.' });
                else
                    {
                      user.business.company_name = req.body.company_name;
                      user.business.adress = req.body.adress;
                      user.business.registration_number = req.body.registration_number;
                      user.business.website = req.body.website;
                  
                      User.updateOne({_id: user._id}, user).then(
                        () => {
                          res.status(201).json({
                            message: 'User updated successfully!'
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
            });   
}



exports.sendCode = function(req,res,next)
{
          User.exists({ phoneNumber: req.body.phoneNumber}, function (err, exist) {
            if (err) {
              res.send(err);
            }
            else {
              if (exist) {
                return   res.status(406).json({message:"phone number already used" });          
              }
              else {

                client.verify.services(serviceSid)
                  .verifications
                  .create({ to: req.body.phoneNumber, channel: 'sms' })
                  .then(verification => {
                    if (verification.status == "pending") {
                      User.findOne({ email: req.body.email },
                        (err, user) => {
                            if (!user)
                                return res.status(404).json({ message: 'User record not found.' });
                            else
                                {
                                  user.phoneNumber = req.body.phoneNumber;
                                  User.updateOne({email: req.body.email}, user).then(
                                    () => {
                                      res.status(200).json({ message: "SMS sent successfuly" });
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
                  });
                
              }
            }
          });
          
        

}

exports.verifCode = function(req,res,next)
{
  console.log('verification now');

      // si le compte n'est pas activé
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
                              res.json({verified: true,"token": user.generateJwt() });
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
              res.json({verified: false });
            })
            .catch(error => res.json({ error: "error", verified: false }));

}

exports.authenticate = (req, res, next) => {
  // call for passport authentication
  passport.authenticate('local', (err, user, info) => {       
      // error from passport middleware
      if (err) return res.status(400).json(err);
      // registered user
      else if (user) return res.status(200).json({ "token": user.generateJwt() });
      // unknown user or wrong password
      else return res.status(404).json(info);
  })(req, res);
}


exports.taxRegistration = (req, res) => {
  // call for passport authentication
  passport.authenticate('local', (err, user, info) => {       
      // error from passport middleware
      if (err) return res.status(400).json(err);
      // registered user
      else if (user) return res.status(200).json({ "token": user.generateJwt() });
      // unknown user or wrong password
      else return res.status(404).json(info);
  })(req, res);
}