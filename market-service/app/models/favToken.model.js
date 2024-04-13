const mongoose = require('mongoose');

const favToken = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  tokens: {
    type: [String],
    default: [],
  },
});

const Ftok = mongoose.model('Favourite_tokens', favToken);

module.exports = Ftok;
