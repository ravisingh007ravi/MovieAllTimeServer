const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/routes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const portId = process.env.PORT || 5000;

mongoose.connect(process.env.MongooseDB)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

app.use('/', router);

app.listen(portId, () => {
    console.log(`Server is running on port ${portId}`);
});
