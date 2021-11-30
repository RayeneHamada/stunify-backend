
const mongoose = require('mongoose'),
  User = mongoose.model('Users');
Notification = mongoose.model('Notifications');
const path = require('path');
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
const ObjectId = mongoose.Types.ObjectId;
var moment = require('moment');
var admin = require("firebase-admin");
const pathToServiceAccount = path.join(__dirname, '../config/firebase/stunify-ca0c5-firebase-adminsdk-3n4rl-a4e95e9ac0.json');
console.log(pathToServiceAccount);
const serviceAccount = require(pathToServiceAccount);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://stunify-c28a5-default-rtdb.europe-west1.firebasedatabase.app"
});

var week = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
exports.sendCode = function (req, res) {
  client.verify.services(serviceSid)
    .verifications
    .create({ to: req.body.phoneNumber, channel: 'sms' })
    .then(verification => {
      if (verification.status == "pending") {


        User.exists({ phoneNumber: req.body.phoneNumber }, function (err, exist) {
          if (err) {
            res.send(err);
          }
          else {
            // si le compte est activé
            if (exist) {
              return res.status(200).json({ sms_state: "sms sent correctly" });

            }
            else {
              var user = new User();
              user.phoneNumber = req.body.phoneNumber;
              user.save((err, doc) => {
                if (!err) {
                  return res.status(200).json({ sms_state: "sms sent correctly" });
                }
              });
            }
          }
        });

      }
    })
    .catch(error => console.log(error));

}

exports.sendCodeTest = function (req, res) {

  User.findOne({ phoneNumber: req.body.phoneNumber },
    (err, user) => {
      if (!user) {
        console.log('ahla1');
        var user = new User();
        user.activated = true;
        user.phoneNumber = req.body.phoneNumber;
        user.save((err, doc) => {
          if (!err) {
            return res.json({ operatiton: "signup", verified: true, "token": doc.generateJwt() });

          }
          else {
            return res.json({ 'error': err });
          }
        });
      }
      else {
        if (user.profile_image)
          res.json({ operatiton: "login", verified: true, "token": user.generateJwt(), "firstName": user.firstName, "lastName": user.lastName, "profile_image": user.profile_image });
        else
          res.json({ operatiton: "login", verified: true, "token": user.generateJwt(), "firstName": user.firstName, "lastName": user.lastName });


      }
    });

}

exports.sendBusinessCodeTest = function (req, res) {

  User.findOne({ phoneNumber: req.body.phoneNumber },
    (err, user) => {
      if (!user) {
        var user = new User();
        user.activated = true;
        user.role = "business";
        user.phoneNumber = req.body.phoneNumber;
        user.business.catrgories = req.body.categories;
        user.business.businessName = req.body.businessName;
        user.business.role = req.body.role;
        if (user.business.role == "freelance") {
          user.business.mobility = req.body.mobility;
        }
        user.save((err, doc) => {
          if (!err) {
            return res.json({ operatiton: "signup", verified: true, "token": doc.generateJwt() });

          }
        });
      }
      else {
        if (user.profile_image)
          res.json({ operatiton: "login", verified: true, "token": user.generateJwt(), "firstName": user.firstName, "lastName": user.lastName, "profile_image": user.profile_image });
        else
          res.json({ operatiton: "login", verified: true, "token": user.generateJwt(), "firstName": user.firstName, "lastName": user.lastName });


      }
    });

}

exports.sendBusinessCode = function (req, res) {
  client.verify.services(serviceSid)
    .verifications
    .create({ to: req.body.phoneNumber, channel: 'sms' })
    .then(verification => {
      if (verification.status == "pending") {


        User.exists({ phoneNumber: req.body.phoneNumber }, function (err, exist) {
          if (err) {
            res.send(err);
          }
          else {
            // si le compte est activé
            if (exist) {
              return res.status(200).json({ sms_state: "sms sent correctly" });

            }
            else {
              var user = new User();
              user.role = "business";
              user.phoneNumber = req.body.phoneNumber;
              user.business.catrgories = req.body.categories;
              user.business.businessName = req.body.businessName;
              user.business.role = req.body.role;
              if (user.business.role == "freelance") {
                user.business.mobility = req.body.mobility;
              }
              user.save((err, doc) => {
                if (!err) {
                  return res.status(200).json({ sms_state: "sms sent correctly" });
                }
              });
            }
          }
        });

      }
    })
    .catch(error => console.log(error));

}

exports.verifCode = function (req, res) {
  console.log('verification now');

  User.exists({ phoneNumber: req.body.phoneNumber, activated: true }, function (err, exist) {
    if (err) {
      res.send(err);
    }
    else {
      // si le compte est activé
      if (exist) {
        client.verify.services(serviceSid)
          .verificationChecks
          .create({ to: req.body.phoneNumber, code: req.body.code })
          .then(verification_check => {
            if (verification_check.status == "approved") {
              User.findOne({ phoneNumber: req.body.phoneNumber },
                (err, user) => {
                  if (!user)
                    return res.status(404).json({ status: false, message: 'User record not found.' });
                  else {
                    if (user.profile_image)
                      res.json({ operatiton: "login", verified: true, "token": user.generateJwt(), "firstName": user.firstName, "lastName": user.lastName, "profile_image": user.profile_image });
                    else
                      res.json({ operatiton: "login", verified: true, "token": user.generateJwt(), "firstName": user.firstName, "lastName": user.lastName });


                  }
                });
            }
            else
              res.json({ operatiton: "login", verified: false });
          })
          .catch(error => res.status(404).json(error));
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
                  else {
                    user.activated = true;
                    User.updateOne({ phoneNumber: user.phoneNumber }, user).then(
                      () => {
                        res.json({ operatiton: "signup", verified: true, "token": user.generateJwt() });
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

exports.completeSubscription = function (req, res) {

  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ message: 'User record not found.' });
      else {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;

        User.updateOne({ _id: user._id }, user).then(
          () => {

            res.status(201).json({
              message: user.role + ' updated successfully!'
            });
          }
        ).catch(
          (error) => {
            console.log(error);
            res.status(400).json({
              error: error
            });
          }
        );
      }
    });

}

exports.completeBusinessSignup = async function (req, res) {
  const loc = await geocoder.geocode({
    address: req.body.address.street + " " + req.body.address.city,
    //country: "Switzerland",
    country: req.body.country,
    zipcode: req.body.address.zip
  });
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ message: 'User record not found.' });
      else {
        user.email = req.body.email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.business.kbis = req.body.kbis;
        var address = { "street": req.body.address.street, "zip": req.body.address.zip, "city": req.body.address.city };
        address.geolocation = {
          coordinates: [loc[0].latitude, loc[0].longitude],
        };
        user.address = address;
        User.updateOne({ _id: user._id }, user).then(
          () => {

            res.status(201).json({
              message: user.business.role + ' updated successfully!'
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


exports.updateProfile = async (req, res) => {
  User.findOne({ _id: req._id },
    async (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.phoneNumber = req.body.phoneNumber;
        const loc = await geocoder.geocode({
          address: req.body.address.street,
          country: req.body.address.country,
          zipcode: req.body.address.zip
        });
        var address = { "street": req.body.address.street, "zip": req.body.address.zip, "city": req.body.address.city, "country": req.body.address.country };
        address.geolocation = {
          coordinates: [loc[0].latitude, loc[0].longitude],
        };
        user.address = address;
        User.updateOne({ _id: user._id }, user).then(
          () => {
            res.status(201).json({
              message: 'Profile updated successfully!'
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
      else {
        user.profile_image = req.file.filename;
        User.updateOne({ _id: user._id }, user).then(
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

exports.updateLogo = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        user.business.logo = req.file.filename;
        User.updateOne({ _id: user._id }, user).then(
          () => {
            res.status(201).json({
              message: 'Logo updated successfully!'
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

exports.updateOwnerPicture = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        user.business.owner_picture = req.file.filename;
        User.updateOne({ _id: user._id }, user).then(
          () => {
            res.status(201).json({
              message: 'owner_picture updated successfully!'
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

exports.addSpacePhotos = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        user.business.logo = req.file.filename;
        User.updateOne({ _id: user._id }, user).then(
          () => {
            res.status(201).json({
              message: 'Logo updated successfully!'
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

exports.updateDescription = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        user.business.prestation_description = req.body.prestation_description;
        user.business.about = req.body.about;
        User.updateOne({ _id: user._id }, user).then(
          () => {
            res.status(201).json({
              message: 'Description updated successfully!'
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

exports.updateSchedule = (req, res) => {
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        user.business.schedule = req.body.schedule;
        User.updateOne({ _id: user._id }, user).then(
          () => {
            res.status(201).json({
              message: 'Schedule updated successfully!'
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
      else {

        var address = { "street": req.body.street, "zip": req.body.zip, "city": req.body.city, "country": req.body.country };
        address.geolocation = {
          coordinates: [loc[0].latitude, loc[0].longitude],
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

exports.updateAddressReverse = async (req, res) => {

  const loc = await geocoder.reverse({
    lat: req.body.lat,
    lon: req.body.lon,
  });
  res.send(loc);
  User.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {

        var address = { "street": loc[0].streetName, "zip": loc[0].zipcode, "city": loc[0].city };
        address.geolocation = {
          coordinates: [req.body.lat, req.body.lon],
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
      else {
        prestation = { "name": req.body.name, "description": req.body.description, "duration": req.body.duration, "price": req.body.price, "category": req.body.category };
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
      {
        "$geoNear": {
          "near": {
            "type": "Point",
            "coordinates": [req.body.lng, req.body.lat]
          },
          "distanceField": "distance",
          "spherical": true,
          "maxDistance": 1000000000,
          "query": { "role": "business", "business.role": "salloon" },
        }
      },
      {
        "$project": { "_id": 1, "address.city": 1, "rate": 1, "business.businessName": 1, "distance": 1, "profile_image": 1 }
      }
    ],
    function (err, results) {
      var saloons = results;
      User.aggregate(
        [
          {
            "$geoNear": {
              "near": {
                "type": "Point",
                "coordinates": [req.body.lng, req.body.lat]
              },
              "distanceField": "distance",
              "spherical": true,
              "maxDistance": 1000000000,
              "query": { "role": "business", "business.role": "freelance" },
            }
          },
          {
            "$project": { "_id": 1, "address.city": 1, "rate": 1, "business.mobility": 1, "business.businessName": 1, "distance": 1, "profile_image": 1 }
          }
        ],
        function (err, results) {
          var freelancers = results;

          res.status(201).send({ "saloons": saloons, "freelancers": freelancers });
        }
      )
    }
  )
}

exports.search = (req, res) => {
  let query = { $and: [] };
  let main = {$or:[
    { 'business.businessName': { '$regex': new RegExp(req.body.search, "i") } },
    { 'firstName': { '$regex': new RegExp(req.body.search, "i") } },
    { 'lastName': { '$regex': new RegExp(req.body.search, "i") } },
    { 'business.prestations.name': { '$regex': new RegExp(req.body.search, "i") } }
  ]};
  query.$and.push(main);
  if (req.body.categories || req.body.categories.length) {
    let categories = { "business.catrgories": { $in: req.body.categories } };
    query.$and.push(categories);

  }
  if (req.body.price) {
    let price = { "business.prestations.price": { $gt: req.body.price[0], $lte: req.body.price[1] } };
    query.$and.push(price);

  }

  if (req.body.date) {
    let d = new Date(req.body.date);
    day = d.getDay();
    day = week[day];
    let date = { $and: [{ "business.schedule.day": day },{"business.schedule.work": true }] };
    query.$and.push(date);

  }
  User.find(query, (err, docs) => {
    if (!err) {
      res.send({"resultat":docs,"query":query});
    }
  })
/*
  User.aggregate(
    [
      {
        "$geoNear": {
          "near": {
            "type": "Point",
            "coordinates": [req.body.lng, req.body.lat]
          },
          "distanceField": "distance",
          "spherical": true,
          "maxDistance": 1000000000,
          "query": { "role": "business", "business.role": "salloon" },
        }
      },
      {
        "$project": { "_id": 1, "address.city": 1, "rate": 1, "business.businessName": 1, "distance": 1, "profile_image": 1 }
      }
    ],
    function (err, results) {
      var saloons = results;
      User.aggregate(
        [
          {
            "$geoNear": {
              "near": {
                "type": "Point",
                "coordinates": [req.body.location.lng, req.body.location.lat]
              },
              "distanceField": "distance",
              "spherical": true,
              "maxDistance": req.body.distance[1],
              "maxDistance": req.body.distance[0],
              "query": { "role": "business", "business.role": "freelance" },
            }
          },
          {
            "$project": { "_id": 1, "address.city": 1, "rate": 1, "business.mobility": 1, "business.businessName": 1, "distance": 1, "profile_image": 1 }
          }
        ],
        function (err, results) {
          var freelancers = results;

          res.status(201).send({ "saloons": saloons, "freelancers": freelancers });
        }
      )
    }
  )*/

}

exports.myBusinessProfile = function (req, res) {

  User.findOne({ _id: req._id }, 'business.prestation_description business.about business.mobility business.prestations business.schedule business.businessName ', (err, user) => {
    if (!user)
      return res.status(404).json({ message: 'Profile record not found.' });
    else {
      res.status(200).json(user);
    }
  });

}

exports.myProfile = function (req, res) {

  User.findOne({ _id: req._id }, 'phoneNumber email firstName lastName profile_image business.kbis address', (err, user) => {
    if (!user)
      return res.status(404).json({ message: 'Profile record not found.' });
    else {
      res.status(200).json(user);
    }
  });

}

exports.myDescription = function (req, res) {

  User.findOne({ _id: req._id }, 'business.prestation_description business.about', (err, user) => {
    if (!user)
      return res.status(404).json({ message: 'Profile record not found.' });
    else {
      res.status(200).json(user);
    }
  });

}

exports.getSalloon = function (req, res) {

  User.findOne({ _id: req.params.id }).
    populate({ path: 'feedbacks.owner', select: 'firstName' }).
    populate({ path: 'feedbacks.owner', select: 'lastName' }).
    populate({ path: 'feedbacks.owner', select: 'profile_image' }).
    exec((err, user) => {
      if (!user)
        return res.status(404).json({ message: 'Salloon record not found.' });
      else {
        return res.status(200).json(user);

      }
    });

}

exports.getFreelance = function (req, res) {

  User.findOne({ _id: req.params.id }).
    populate({ path: 'feedbacks.owner', select: 'firstName' }).
    populate({ path: 'feedbacks.owner', select: 'lastName' }).
    populate({ path: 'feedbacks.owner', select: 'profile_image' }).
    exec((err, user) => {
      if (!user)
        return res.status(404).json({ message: 'Freelance record not found.' });
      else {
        return res.status(200).json(user);

      }
    });

}

exports.getPrestations = function (req, res) {


  User.findOne({ _id: req.params.id }).
    populate({ path: 'business.prestations.category', select: 'name' }).
    exec((err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'Business record not found.' });
      else {
        res.status(200).send(sortPrestations(user.business.prestations));
      }
    });

}

exports.myPrestations = function (req, res) {


  User.findOne({ _id: req._id }).
    populate({ path: 'business.prestations.category', select: 'name' }).
    exec((err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'Business record not found.' });
      else {
        res.status(200).send(sortPrestations(user.business.prestations));
      }
    });

}

exports.mySchedule = function (req, res) {


  User.findOne({ _id: req._id }).
    populate({ path: 'business.schedule'}).
    exec((err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'Business record not found.' });
      else {
        res.status(200).send(user.business.schedule);
      }
    });

}

exports.addFeedBack = function (req, res) {
  User.findOne({ _id: req.body.businessId },
    (err, business) => {
      if (!business)
        return res.status(404).json({ status: false, message: 'Business record not found.' });
      else {
        var rate = (req.body.quality + req.body.atmosphere + req.body.cleanliness + req.body.reception) / 4;
        User.updateOne({ _id: business._id }, { $push: { feedbacks: { "quality": req.body.quality, "atmosphere": req.body.atmosphere, "cleanliness": req.body.cleanliness, "reception": req.body.reception, "rate": rate, "feedback_content": req.body.feedback_content, "owner": req._id } } }).then(
          (result, error1) => {
            notification = new Notification();
            notification.sender = req._id;
            notification.receiver = req.body.businessId;
            notification.type = 'feedback';
            notification.content = 'vous a noté' + rate + " étoiles";
            notification.save((err, doc) => {
              if (!err) {
                return res.status(201).json({
                  message: 'Feedback added successfully!'
                });
              }
              else {
                return res.json({ 'error': err });
              }
            });
          }
        ).catch(
          (error2) => {
            res.status(400).json({
              error: error2
            });
          }
        );

      }

    });
}

function sortPrestations(prestations) {
  let result = [];
  prestations.forEach(element => {
    if (result.indexOf(element.category) == -1) {
      result.push({ "category": element.category, "prestations": [] });
    }
  });
  result.forEach(category => {
    prestations.forEach(prestation => {
      if (prestation.category == category.category) {
        category.prestations.push(prestation);
      }
    })
  })
  return result;
}


exports.availableSlots = function (req, res) {
  User.findOne({ _id: req.params.business }).
    populate('business.appointments').
    exec((err, user) => {
      if (!user)
        return res.status(404).json({ message: 'Freelance record not found.' });
      else {
        let duration = req.params.duration,
          date = new Date(req.params.year, req.params.month - 1, req.params.day, 0, 0, 0, 0),
          day = date.getDay(),
          schedule_day = user.business.schedule[day],
          isWorkDay = schedule_day.work,
          slots = schedule_day.slot,
          availabilities = [];
        appointments = user.business.appointments;
        if (isWorkDay) {
          slots.forEach((slot) => {

            let start_time_hour = slot.start_time.split(":")[0],
              start_time_minute = slot.start_time.split(":")[1],
              start_time = new Date(req.params.year, req.params.month, req.params.day, start_time_hour, start_time_minute, 0, 0),
              end_time_hour = slot.end_time.split(":")[0],
              end_time_minute = slot.end_time.split(":")[1],
              end_time = new Date(req.params.year, req.params.month, req.params.day, end_time_hour, end_time_minute, 0, 0),
              aux_time = moment(start_time).add(duration, 'minutes').toDate(),
              isValid = true;
            while (moment(aux_time).isBefore(end_time)) {
              appointments.forEach((appointment) => {
                isValid = true;
                if ((moment(aux_time).isAfter(appointment.start_date_time) && moment(start_time).isBefore(appointment.start_date_time))
                  || (moment(start_time).isBefore(appointment.end_date_time) && (moment(aux_time).isAfter(appointment.end_date_time)))) {
                  isValid = false;
                }
              })
              if (isValid) {
                availabilities.push({ start: start_time, end: aux_time });
              }
              start_time = aux_time;
              aux_time = moment(start_time).add(duration, 'minutes').toDate();

            }

          })
        }
        res.send(availabilities);
      }
    });

}

exports.testNotif = (req, res) => {
  const message = {
    notification: {
      title: 'New Messaeg',
      body: 'test test 12 12',
    },
    topic: "general"
  }
  sendPushNotification(message)
}

function sendPushNotification(message) {
  admin.messaging().send(message)
    .then((response) => {
      console.log('Scuccessfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    })
}


