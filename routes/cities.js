const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const City = require('../models/city');
const router = express.Router();

//const basicAuth = require('express-basic-auth');

// const auth = basicAuth({
//   users: {'ketansutar':'simple'},
//   unauthorizedResponse: {message : 'Unauthorized'}
// });

// Middleware for authentication
function authenticateToken (req, res, next) {  
  //const token = req.headers['authorization'];
  const authHeader = req.headers['authorization'];
  // Check if bearer token is there
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ message: 'Authentication token is required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(403).json({message: 'Invalid token'});
    }  
    req.userId = decoded.userId;
    next();
  });
};


//add auth instead of authenticateToken to use basicAuth and uncomment above basicAuth code
router.post('/add', authenticateToken, async ( req, res) => {
  const { name } = req.body;
 
  if (!name) {
    return res.status(400).json({ message: "City name is required" });
  }
  try {
    const newCity = new City({ name });
    await newCity.save();
    res.status(201).json({message: "City Added Successfully"});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


//Api to delete city using cityname
router.post('/delete', async ( req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "City name is required" });
  }

  try {
    const result = await City.findOneAndDelete({ name });
    
    if (!result) {
      return res.status(400).json({ message: "City Not Found"});
    }
    res.send({ message : "City Deleted Successfully !"});   
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


//search and update city name
router.put('/update/:name', async ( req, res) => {

  const cityName = req.params.name;
  const newCityName = req.body.name;

  try { 
    const avlCity = await City.findOne({name: cityName});
    if (!avlCity) {
      return res.status(400).json({ message: "City not found" });
    }
    
    avlCity.name = newCityName;
    const updatedCity = await avlCity.save();
    res.status(201).json({message: "City updated Successfully", updatedCity});

    } catch (error) {
      res.status(400).json({ message: error.message });
  }
});
module.exports = router;
