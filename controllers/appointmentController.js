  
const mongoose  = require('mongoose'),
Appointment = mongoose.model('Appointments');
User = mongoose.model('Users');
var moment = require('moment'); 
const { ConversationList } = require('twilio/lib/rest/conversations/v1/conversation');
const ObjectId = mongoose.Types.ObjectId;



exports.book = function(req,res,next)
{
    appointment = new Appointment();
    appointment.personal = req._id;
    appointment.business = req.body.business;
    appointment.start_date_time = req.body.start_date_time;
    appointment.end_date_time = req.body.end_date_time;
    appointment.prestation = req.body.prestation;
    appointment.payment_method = req.body.payment_method;
    appointment.save((err,doc) => {
        if (err) {

            if (err.code === 11000)
            return res.status(500).json({message:"Appointment already exits"});
        }
        else {
            User.findOne({ _id: req.body.business },
                (err, business) => {
                    if (business)
                    {
                        User.updateOne({ _id: req.body.business }, { $push: { "business.appointments": new mongoose.mongo.ObjectId(doc._id) } }).then(
                              (result, error1) => {
                                User.findOne({ _id: req._id },
                                    (err, personal) => {
                                        if (personal)
                                        {
                                                User.updateOne({_id: req._id}, { $push: { "personal.appointments": new mongoose.mongo.ObjectId(doc._id)} }).then(
                                                  (result, error1) => {
                                                    res.status(201).json(doc);
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
    })
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
                    isValid = true;
                appointments.forEach((appointment) => {
                  if ((moment(aux_time).isAfter(appointment.start_date_time) && moment(start_time).isBefore(appointment.start_date_time))
                      || (moment(start_time).isBefore(appointment.end_date_time) && (moment(aux_time).isAfter(appointment.end_date_time)))
                      || (moment(start_time).isSame(appointment.start_date_time))
                      || ((moment(aux_time).isSame(appointment.end_date_time)))) {
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


exports.dashboard = function(req,res)
{

  User.findOne({ _id: req._id }, 'business.appointments').
    populate({ path: 'business.appointments'}).
    populate({ path: 'business.appointments.personal', select: 'firstName' }).
    populate({path: 'business.appointments.personal', select:'lastName'}).
    populate({path: 'business.appointments.personal', select:'profile_image'}).
    exec((err, result) => {
      if (!result)
        return res.status(404).json({ message: 'Salloon record not found.' });
      else {
        var appointments = result.business.appointments;
        console.log(appointments);
        let done = [];
        let todo = [];
        let doing = [];
        appointments.forEach((appointment) => {
          if (moment(new Date(appointment.end_date_time)).isBefore(new Date())) {
            done.push(appointment);
          }
          if (moment(new Date(appointment.end_date_time)).isAfter(new Date()) && moment(new Date(appointment.start_date_time)).isBefore(new Date())) {
            doing.push(appointment);
          }
          if (moment(new Date(appointment.start_date_time)).isAfter(new Date())) {
            todo.push(appointment);
          }
        })
        return res.status(200).json({ "todo": todo, "doing":doing,"done":done});
        
      }
    });
  
}
/* A refaire */
exports.appointmentPerDay = function(req,res)
{

  User.findOne({ _id: req._id }, 'business.appointments').
    populate({ path: 'business.appointments'}).
    populate({ path: 'business.appointments.personal', select: 'firstName' }).
    populate({path: 'business.appointments.personal', select:'lastName'}).
    populate({path: 'business.appointments.personal', select:'profile_image'}).
    exec((err, results) => {
      if (!results)
        return res.status(404).json({ message: 'Salloon record not found.' });
      else {
        let result = [];
        let appointments = results.business.appointments;
        appointments.forEach((appointment) => {
          if (moment(new Date(req.body.date).setHours(0,0,0,0)).isSame(new Date(appointment.start_date_time).setHours(0,0,0,0))) {
            result.push(appointment);
          }
        })
        return res.status(200).json(result);
        
      }
    });
  
}