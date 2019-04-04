import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import config from './../config/config.json';

const app = express();

// Add midlewear to pars data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// start server
const port = config.port || 4000;
const server = app.listen(port, async() => {
    mongoose.connect(config.mongo.uri, config.mongo.options);
    console.log('Server listening on port ' + port);
});