const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var prestationSchema = new mongoose.Schema({

  name: {
    type: String
  },
  description: {
    type: String
  },
  duration: {
    type: Number,
  },
  price: {
    type: Number
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories"
  }

  });

  prestationSchema.index({ "name": "text" });
mongoose.model('Prestations', prestationSchema);