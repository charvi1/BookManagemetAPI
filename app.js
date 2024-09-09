const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route imports
const bookRoutes = require('./routes/book');

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.log('Failed to connect to MongoDB Atlas', error));

// Routes
app.use('/api/books', bookRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
