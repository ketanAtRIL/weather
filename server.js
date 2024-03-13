require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const weatherRoutes = require('./routes/weather');
const cityRoutes = require('./routes/cities');

//const uri = "mongodb+srv://ketansutar2022:Simple@123@weather.zkpmrmv.mongodb.net/?retryWrites=true&w=majority&appName=weather"

app.use(express.json()); // Middleware to parse JSON bodies

const port = process.env.PORT || 3000;


// MongoDB connection
mongoose.connect('mongodb://localhost:27017/weather', 
{ 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
  username : {type: String, required: true},
  password: {type: String, required: true}
});

const Login = mongoose.model('Login', userSchema, 'login');

app.use('/api/weather', weatherRoutes);
app.use('/api/cities', cityRoutes);

app.post('/login', async (req, res) => {
  const {username, password } = req.body;

  try {
    const user = await Login.findOne({ username });
    if(!user) {
      return res.status(404).json({ message : "User not found"});
    }
    const passHash = await bcrypt.hash(user.password, 10);
    const isValidPassword = await bcrypt.compare(password, passHash);

    if(!isValidPassword) {
      return res.status(401).json({ message : "Invalid Password"});
    }

    const token = jwt.sign({ userId : user._id }, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server Error'});
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

