/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require('../connection')
const projectSchema = require('../models/library')
const { model } = require('mongoose')

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      let Library = model('Library', projectSchema)
      Library.find({}, function(err, books) {
        if (err) throw err
        res.json(books)
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      let Library = model('Library', projectSchema)
      let book = new Library({
        title: title,
      })
      book.save(function(err) {
        if (err) {
          res.send('mising required field title')
          return
        }
        res.send({_id: book._id, title: book.title})
      })
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      let Library = model('Library', projectSchema)
      Library.deleteMany({}).then(function(){
        res.send("complete delete successful"); // Success
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      let Library = model('Library', projectSchema)
      Library.findOne({_id: bookid}, function(err, book) {
        if (err) {
          throw err
        }
        if (!book) {
          res.send("no book exist")
          return
        } else {
          res.json({
            comments: book['comments'],
            _id: book['_id'],
            title: book['title'],
            commentcount: book['commentcount'],
            __v: book['__v']
          })
        }
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res){
      if (!req.body.hasOwnProperty('comment') || req.body.comment == "") {
        res.send("missing required field comment")
        return
      }
      let bookid = req.params.id;
      let comment = req.body.comment;
      let Library = model('Library', projectSchema)
      Library.findOne({_id: bookid}, function(err, book) {
        if (err) {
          throw err
        }
        if (!book) {
          res.send("no book exists")
          return
        }
        book.comments.push(comment)
        book.commentcount = book.commentcount + 1 
        book.save(function (err, newBook){
          if (err) throw err
          res.json(newBook)
        })
      })
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      let Library = model('Library', projectSchema)
      Library.deleteOne({_id: bookid}, function(err) {
        if (err) {
          res.send("no book exists")
          return
        }
        res.send("delete successful")
      })
      //if successful response will be 'delete successful'
    });
  
};
