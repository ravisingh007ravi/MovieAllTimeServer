const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes.js');
require('dotenv').config();


const app = express();
app.use(express.json());

const port = 5000

mongoose.connect(process.env.MongoDBURL)
    .then(() => { console.log("MongoDB is connected") })
    .catch((error) => { console.log(error) })

app.use('/', routes);

app.listen(port, () => { console.log(`Server is Running on port ${port}`); });