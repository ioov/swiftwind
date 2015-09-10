'use strict';
let fs = require('fs');
let Post = require('../models/Post');
let config = require('../config');
let mongoose = require('mongoose');

mongoose.connect(config.db['development']);
let db = mongoose.connection;
db.once('open', function (callback) {
  Post.find({}, function (err, posts) {
    if (err) throw err;
    fs.writeFile('imagine-dump.json', JSON.stringify(posts), 'utf8', function (err) {
      console.log("It's saved!");
      mongoose.disconnect();
    });
  });
});