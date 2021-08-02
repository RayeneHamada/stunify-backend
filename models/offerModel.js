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
      profile_image: {
        type:String  
      },
      address: {
          street: {
            type:String
          },
          zip: {
            type:String
          },
          city: {
            type:String
          },
          country: {
            type: String,
            default:'switzerland'
          }
        
      },
      role: {
          type: String,
          default: 'user'
      },
      saloon: {
        rate: {
          type: Number,
          default:0
        }
      },
      freelancer: {
        rate: {
          type: Number,
          default: 0
        },
        mobility: {
          type: Boolean,
          default: true
        }
      }
      
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