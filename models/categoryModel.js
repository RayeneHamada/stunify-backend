const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var categorySchema = new mongoose.Schema({

  name:{
    type: String,
    unique: true,
    required : true
  },
  icon:{
    type: String,
    required : true
  }

  });


mongoose.model('Categories', categorySchema);