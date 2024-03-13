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
  //const { weather } = req.body;
  //const { temparature } = req.body;
  if (!name) {
    return res.status(400).json({ message: "City name is required" });
  }
  try {
    const newCity = new City({ name });
    await newCity.save();
    res.status(201).json(newCity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
