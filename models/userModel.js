const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({



      phoneNumber: {
        type: String,
        required: " Phone  number can\'t be empty",
        unique : true
      },
      
    activated: {
      type: Boolean,
      default: false
      },
  
      email: {
        type: String,
        lowercase: true
      },
      firstName: {
          type: String,
      },
      lastName: {
        type: String,
      },
      role: {
          type: String,
          required: 'Role can\'t be empty',
          default: 'user'
      },
  });

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');



userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id, role: this.role},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}
userSchema.methods.usePasswordHashToMakeToken = function(){
    const secret = this.password + "-" + this.create_date
    const token = jwt.sign({id:this._id}, process.env.JWT_SECRET, {
      expiresIn: 36000 // 1 hour
    })
    return token
  }



mongoose.model('Users', userSchema);