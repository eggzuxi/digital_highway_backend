const mongoose = require('mongoose');

const SnsImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const SnsImage = mongoose.model("Image", SnsImageSchema);

module.exports = SnsImage;