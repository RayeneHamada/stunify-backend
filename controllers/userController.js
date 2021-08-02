  
const mongoose = require('mongoose'),
User = mongoose.model('Users');
const passport = require('passport');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.SERVICE_SID;
const client = require('twilio')(accountSid, authToken);
const axios = require('axios').default;
const geocoder = require('../utils/geocoder');


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
                  user.role = req.body.role;
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


exports.completeBusinessSignup = function(req,res,next)
{
          User.findOne({email: req.body.email },
            (err, user) => {
                if (!user)
                    return res.status(404).json({ message: 'User record not found.' });
                else
                {
                  user.role = "business";
                  user.business.role = req.body.role;
                  user.business.description = req.body.description;
                  user.business.rate = req.body.rate;
                  
                      if(req.body.role == "freelance")
                      {
                        user.firstName = req.body.firstName;
                        user.lastName = req.body.lastName;
                      }
                      else
                      {
                        user.saloonName = req.body.saloonName      
                      }
                  
                  
                      User.updateOne({_id: user._id}, user).then(
                        () => {
                          res.status(201).json({
                            message: user.business.role+' updated successfully!'
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



exports.updateProfileImage = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
        if (!user)
            return res.status(404).json({ status: false, message: 'User record not found.' });
        else
            {
              user.profile_image = req.file.filename;
              User.updateOne({_id: user._id}, user).then(
                () => {
                  res.status(201).json({
                    message: 'User profile image successfully!'
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


exports.updateAddress = async (req, res) => {
  
  const loc = await geocoder.geocode({
    address: req.body.street,
    country: req.body.country,
    zipcode: req.body.zip
  });
    
    User.findOne({ _id: req._id },
      (err, user) => {
          if (!user)
              return res.status(404).json({ status: false, message: 'User record not found.' });
          else
          {
            
            
            var address = { "street": req.body.street, "zip": req.body.zip, "city": req.body.city, "country": req.body.country};
            address.geolocation = {
              coordinates: [loc[0].longitude, loc[0].latitude],
            };
            user.address = address;
            console.log(user);

            User.updateOne({ _id: user._id }, user).then(
              () => {
                    res.status(201).json({
                      message: 'User address updated successfully!'
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
  
exports.addPrestation = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
        if (!user)
            return res.status(404).json({ status: false, message: 'User record not found.' });
        else
        {
              prestation = { "name": req.body.name, "description": req.body.description, "duration": req.body.duration, "price": req.body.price, "category": req.body.category, "gender": req.body.gender };
              adress = {"address_name":req.body.address_name,"street":req.body.street,"landmark":req.body.landmark,"city":req.body.city}
              User.updateOne({ _id: user._id }, { $push: { "business.prestations": prestation } }).then(
                () => {
                  res.status(201).json({
                    message: 'Prestation added successfully!'
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
  
exports.home = (req, res) => {
  
   User.aggregate(
    [
        { "$geoNear": {
            "near": {
                "type": "Point",
                "coordinates": [req.body.lng,req.body.lat]
            },
            "distanceField": "distance",
            "spherical": true,
          "maxDistance": 10000,
          "query": { "role": "business" },
        }}
    ],
    function(err,results) {

      res.status(201).send(results);
  }
)
}
