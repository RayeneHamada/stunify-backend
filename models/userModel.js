const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const GeoSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Point'
  },
  coordinates: {
    type: [Number],
  }
});

var userSchema = new mongoose.Schema({

  phoneNumber: {
    type: String,
    required: " Phone  number can\'t be empty",
    unique: true
  },

  activated: {
    type: Boolean,
    default: false
  },
  fcm_id: {
    type: String
  },
  email: {
    type: String,
    lowercase: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },

  profile_image: {
    type: String
  },
  address: {
    street: {
      type: String
    },
    zip: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String,
      default: 'switzerland'
    },

    geolocation: GeoSchema,


  },
  stripe: {
    customerId: {
      type: String
    },
    subscriptionId: {
      type: String
    }
  },
  
  role: {
    type: String,
    default: 'user'
  },

  personal: {
    appointments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointments"
    }],
  },

  business: {

    kbis: {
      type: String,
    },
    subscription_state: {
      type: String,
      default:'inactive'
    },
    role: {
      type: String,
    },

    prestation_description: {
      type: String
    },
    about: {
      type: String
    },
    businessName: {
      type: String
    },
    rate: {
      total: {
        type: Number,
        default: 0,
      },
      reception: {
        type: Number,
        default: 0
      },
      cleanliness: {
        type: Number,
        default: 0
      },
      atmosphere: {
        type: Number,
        default: 0
      },
      prestation_quality: {
        type: Number,
        default: 0
      }

    },
    feedbacks: [{
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
      },
      feedback_content: String,
      rate: {
        avg: {
          type: Number,
          default: 0,
        },
        reception: {
          type: Number,
          default: 0
        },
        cleanliness: {
          type: Number,
          default: 0
        },
        atmosphere: {
          type: Number,
          default: 0
        },
        prestation_quality: {
          type: Number,
          default: 0
        }
      },
      created_at: {
        type: Date,
        default: Date.now
      }
    }],
    catrgories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories"
    }],
    mobility: {
      type: Boolean,
    },
    logo: {
      type: String
    },
    space_pictures: [String],
    owner_picture: {
      type: String
    },

    prestations: [{

      type: mongoose.Schema.Types.ObjectId,
      ref: "Prestations"
    }],
    schedule: [{
      day: {
        type: String
      },
      work: {
        type: Boolean,
      },
      slot:
        [
          {
            start_time: {
              type: String
            },

            end_time: {
              type: String
            }
          }
        ]
    }],
    appointments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointments"
    }],

  },
  created_at: {
    type: Date,
    default: Date.now
  }

});
userSchema.index({ "address.geolocation": "2dsphere" });
userSchema.index({ "business.businessName": "text" });

// Custom validation for email
userSchema.path('email').validate((val) => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid e-mail.');



userSchema.methods.generateJwt = function () {
  return jwt.sign({ _id: this._id, role: this.role, profilePicture: this.profile_image, firstName: this.firstName, lastName: this.lastName, email: this.email, customerId: this.stripe.customerId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXP
    });
}
userSchema.methods.usePasswordHashToMakeToken = function () {
  const secret = this.password + "-" + this.create_date
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: 36000 // 1 hour
  })
  return token
}



mongoose.model('Users', userSchema);