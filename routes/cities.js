const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const City = require('../models/city');
const router = express.Router();

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.post('/add', authenticateToken, async (req, res) => {
  const { name } = req.body;
  const { weather } = req.body;
  const { temparature } = req.body;
  if (!name) {
    return res.status(400).json({ message: "City name is required" });
  }
  try {
    const newCity = new City({ name },{weather},{temparature});
    await newCity.save();
    res.status(201).json(newCity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
