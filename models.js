"use strict";

const mongoose = require('mongoose');

//schema to represent a blog post
const blogPostSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: String, required: true},
    publishDate: {type: Date , required: true}
});

const BlogPost = mongoose.model("Blog Post", blogPostSchema);

module.exports = {BlogPost};