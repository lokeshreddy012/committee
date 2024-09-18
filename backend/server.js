const express = require('express');
const { MongoClient } = require('mongodb');
const usersRoutes = require('./routes/users');
const committeesRoutes = require('./routes/committees');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const uri = process.env.URI;  // Your actual MongoDB URI
let db, usersCollection, committeesCollection;

// Connect to MongoDB
MongoClient.connect(uri)
    .then((client) => {
        console.log('Connected to MongoDB');
        db = client.db('committeesDB');
        usersCollection = db.collection('users');
        committeesCollection = db.collection('committees');

        // Initialize routes after MongoDB connection is successful
        app.use('/users', usersRoutes(usersCollection));
        app.use('/committees', committeesRoutes(committeesCollection));

        // Start the server after initializing routes
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.error('Error connecting to MongoDB:', error));
