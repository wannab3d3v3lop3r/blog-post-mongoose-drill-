"use strict";

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { PORT, DATABASE_URL} = require('./config');
const { Blog } = require('./models');

mongoose.Promise = global.Promise;

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

const app = express();
app.use(express.json());

app.get('/posts',(req,res) => {
    Blog
        //finds documents in Blog collection
        .find()
        //returns a promise if it works out. then does something with the documents (resolve)
        .then(blogs => {
            res.json(blogs.map(blog => blog.serialize()))
        })
        //if something doesnt work
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        })
});

//retrieves a certain document with id
app.get('/post/:id',(req,res) => {
    Blog
        //search document by params id from the url
        .findById(req.params.id)
        //returns a promise if document found
        //return json using serialize. Normally you can return this way
        //res.json({return {obj: object}})
        .then(blog => res.json(blog.serialize()))
        .catch(err =>{
            console.log(err);
            res.status(400).json({message: `Internal server error`})
        });
});


app.post('/posts',(req,res) => {

  /* Checks to see if the req.body consists of the keys */
    const requiredFields = ['title','content','author'];

    /* for loop forEach same thing */
    for(let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            res.status(400).send(message);
        }
    }

    //once the req.body has been checked for its keys, create new document
    Blog
        .create({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
        })
        //returns the following keys above with id
        //the steps is once created, it will produce an id with the following object
        //when return to the client, id will show
        .then(blogPost => res.status(201).json(blogPost.serialize()))
        .catch(err =>{
            console.error(err);
            res.status(400).json({error: `Internal server error`})
        });
});

//updating documents
app.put('/posts/:id', (req,res) => {

    //checks to see if params.id and body.id exist, then compare if the values are the same
    if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
        const message = `Request path id and request body id values must match`;
        console.error(message);
        res.status(400).send(message);
    }

    //create a variable that holds an object with the same key/value pairs as the req.body
    //while checking to see if the keys are in the req.body
    const toUpdate = {};
    const updateableFields = ['title','content','author'];
    updateableFields.forEach(field => {
        if(field in req.body){
            toUpdate[field] = req.body[field];
        }
    })

    
    Blog
        //finds particular document with Id and then update
        //$set: replaces values
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        //once the operation is done, response with the new updated json
        .then(updatedPost => { res.json({
          title: updatedPost.title,
          content: updatedPost.content,
          author: updatedPost.author
        })
        .catch(err => { res.status(500).json({message: `Internal server error`})});
});

app.delete('/posts/id', (req,res) =>{
    Blog
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({message: `Internal server error`}))
})


// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function (req, res) {
    res.status(404).json({ message: 'Not Found' });
  });
  
  // closeServer needs access to a server object, but that only
  // gets created when `runServer` runs, so we declare `server` here
  // and then assign a value to it in run
  let server;
  
  // this function connects to our database, then starts the server
  function runServer(databaseUrl, port = PORT) {
  
    return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl, err => {
        if (err) {
          return reject(err);
        }
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
    });
  }
  
  // this function closes the server, and returns a promise. we'll
  // use it in our integration tests later.
  function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }
  
  // if server.js is called directly (aka, with `node server.js`), this block
  // runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
  if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
  }
  
  module.exports = { app, runServer, closeServer };
  