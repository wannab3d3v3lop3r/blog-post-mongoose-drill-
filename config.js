"use strict";

exports.DATABASE_URL =
    process.env.DATABASE_URL || "mongodb://localhost/blogPost-app";
exports.TEST_DATABASE_URL =
    process.env.TEST_DATABASE_URL || "mongodb://localhost/test-blogPost-app";
exports.PORT = process.env.PORT || 2164;

