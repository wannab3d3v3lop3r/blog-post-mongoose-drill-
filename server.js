"use strict";

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { PORT, DATABASE_URL} = require('./config');
const { blogPost } = require('./models');

mongoose.Promise = global.Promise;

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

const app = express();
app.use(express.json());


const blogPostRouter = require('./blogPostRouter');

app.use('/blog-post', blogPostRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
})