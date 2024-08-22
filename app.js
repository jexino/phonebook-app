require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();

// Set up Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected Successfully");
  } catch (err) {
    console.log('Could not connect to the database', err);
    process.exit(1); // Exit with a non-zero status code to indicate failure
  }
}

connectDB();

// Routes
app.get('/', (req, res) => {
  res.render('phonebookadd', { title: "Phone Book App" });
});

const userRoutes = require('./routes/user');
app.use('/api', userRoutes);


// Start the server

const port = process.env.PORT || 3000;
const MONGOURL = process.env.MONGO_URL;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
