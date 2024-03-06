const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
  ,
  temperature: {
    type: Number,
    required: true
  },
  weather: {
    type: String,
    required: true
  }
}, 
{
  //timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

module.exports = mongoose.model('City', citySchema);
