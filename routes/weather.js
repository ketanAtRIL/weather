const express = require('express');
const axios = require('axios');
const City = require('../models/city');
const router = express.Router();

router.get('/weather', async (req, res) => {
  try {
    const cities =  await City.find({}); 
   cities.forEach(city => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=9887802c27c6c96117445a7764f04e14&units=metric`;
        
    axios.get(apiUrl)
    .then(response => {
        console.log(`Weather for ${city.name}:`, response.data.main.temp);
    })
    });
    console.log("end of list");
  }
  catch(error){
    console.error(`Error fetching weather for ${city.name}:`, error);
  };

});


module.exports = router;
