require('dotenv').config(); // Read environment variables (connection string) from .env
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
// TODO: <dbname> is in the connection string. Should that be "animals" or something?
const connectionString = process.env.CONNECTION_STRING.toString();
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
// MongoClient.connect(connectionString, {useUnifiedTopology:true}, (err, client) => {
//     if(err) return console.error(err);
//     console.log('Connected to MongoDB database');
// });
// Use promises
MongoClient.connect(connectionString, {useUnifiedTopology: true})
    .then(client => {
        console.log("Connected to MongoDB database.");
        const db = client.db('animal-db');
        const animalsCollection = db.collection('animals');
        // Express request handlers belong in MongoClient's .then call
        app.post('/animals', (req, res) => {
            // Add animal to collection
            animalsCollection.insertOne(req.body)
                .then(result => {
                    // Redirect back to /
                    res.redirect('/');
                })
                .catch(error => console.error(error));
        })
    })
    .catch(error => console.error(error));

app.listen(3000, function() {
    console.log('Listening on 3000.');
})

// GET
app.get('/', (req, res) => {
    res.sendFile(__dirname+"/index.html");
})