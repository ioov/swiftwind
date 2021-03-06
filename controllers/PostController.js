'use strict';
let Post = require('../models/Post');
let markdown = require('markdown-it')({breaks: true});

module.exports = {
  create: function *() {
    let req = this.request.body;
    let timestamp = Date.now();
    let data = {
      title: req.title,
      html: markdown.render(req.markdown),
      markdown: req.markdown,
      pid: timestamp,
      created_at: timestamp,
      updated_at: timestamp
    };
    let optParams = ['category', 'status', 'tags'];
    optParams.forEach(function (param) {
      if (req[param]) {
        data[param] = req[param];
      }
    });
    let post = yield Post.create(data);
    this.status = 201;
    this.body = post;
  },
  read: function *(id) {
    let post = yield Post.findOne({pid: id}, {_id: 0, __v: 0}).exec();
    this.status = 200;
    this.body = post;
  },
  list: function *() {
    let query = {};
    if (this.query && this.query.category) {
      query.category = this.query.category;
    }
    let posts = yield Post.find(query, {_id: 0, title: 1, pid: 1}, {sort: {created_at: -1}}).exec();
    this.status = 200;
    this.body = posts;
  },
  update: function *(id) {
    let req = this.request.body;
    let data = {};
    if (req.markdown) {
      data.markdown = req.markdown;
      data.html = markdown.render(req.markdown);
      data.updated_at = Date.now();
    }
    let optParams = ['title', 'category', 'status', 'tags'];
    optParams.forEach(function (param) {
      if (req[param]) {
        data[param] = req[param];
      }
    });
    let post = yield Post.findOneAndUpdate({pid: id}, data).exec();
    this.status = 201;
    this.body = post;
  },
  delete: function *(id) {
    yield Post.findOneAndRemove({pid: id}).exec();
    this.status = 204;
    this.body = null;
  }
};
