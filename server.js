require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const weatherRoutes = require('./routes/weather');
const cityRoutes = require('./routes/cities');

//const uri = "mongodb+srv://ketansutar2022:Simple@123@weather.zkpmrmv.mongodb.net/?retryWrites=true&w=majority&appName=weather"

app.use(express.json()); // Middleware to parse JSON bodies

const port = process.env.PORT || 3000;


// MongoDB connection
mongoose.connect('mongodb://localhost:27017/weather', 
{ 
  //useNewUrlParser: true, useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/weather', weatherRoutes);
app.use('/api/cities', cityRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

