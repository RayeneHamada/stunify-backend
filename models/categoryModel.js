const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var categorySchema = new mongoose.Schema({

  name: {
    type: String,
    unique: true,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  black_picture: {
    type: String
  },
  white_picture: {
    type: String
  },

});


mongoose.model('Categories', categorySchema);