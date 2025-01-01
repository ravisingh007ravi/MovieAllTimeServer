const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes.js');

const app = express();
app.use(express.json());

const MongoDbURl = 'mongodb+srv://kashishgaba225:j9p8n7JWNuxgZt1t@cluster0.7bvgg.mongodb.net/MoviesDataBase';
const port = 5000 || process.env.PORT

mongoose.connect(MongoDbURl)
    .then(() => { console.log("MongoDB is connected") })
    .catch((error) => { console.log(error) })

app.use('/', routes);

app.listen(port, () => { console.log(`Example app listening on port ${port}`); })