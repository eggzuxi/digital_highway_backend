const mongoose = require('mongoose');
const db = mongoose.connection.useDb('community')

const ImageSchema = new mongoose.Schema({
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

const SnsImage = db.model("Image", ImageSchema);

module.exports = SnsImage;