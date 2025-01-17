/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const { model } = require('mongoose')
const projectSchema = require('../models/library')
const Library = model('Library', projectSchema)

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function (done) {
  //   chai.request(server)
  //     .get('/api/books')
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai
          .request(server)
          .post('/api/books')
          .send({
            title: 'test'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.isObject(res.body, 'response should be an object')
            assert.property(res.body, '_id', 'response should have _id property')
            assert.property(res.body, 'title', 'response should have title property')
            done()
          })
      });

      test('Test POST /api/books with no title given', function (done) {
        chai
          .request(server)
          .post('/api/books')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.isString(res.body, 'response should be a String')
            assert.equal(res.body, 'missing required field title')
            done()
          })
      });
    });


    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get('/api/books/' + '6202be8721412ebe14452032') // Random _id
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.isString(res.body, 'response should be an String');
            assert.equal(res.body, "no book exists")
            done()
          })
      })

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        let book = new Library({
          title: "test"
        })
        book.save(function (err, book) {
          chai
            .request(server)
            .get('/api/books/' + book._id)
            .end(function (err, res) {
              assert.equal(res.status, 200)
              assert.isObject(res.body, 'response should be an Object');
              assert.property(res.body, 'commentcount', 'Book should contain commentcount');
              assert.property(res.body, 'title', 'Book should contain title');
              assert.property(res.body, '_id', 'Book array should contain _id');
              assert.property(res.body, 'comments', 'Book should contain commets array');
              assert.isArray(res.body.comments, 'comments should be an Array');
              done()
            })
        })
      });

    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        let book = new Library({
          title: "test"
        })
        book.save(function (err, book) {
          chai
            .request(server)
            .post('/api/books/' + book._id)
            .send({
              comment: "test commentary"
            })
            .end(function (err, res) {
              assert.equal(res.status, 200)
              assert.isObject(res.body, 'response should be an Object');
              assert.property(res.body, 'commentcount', 'Book should contain commentcount');
              assert.property(res.body, 'title', 'Book should contain title');
              assert.property(res.body, '_id', 'Book should contain _id');
              assert.property(res.body, 'comments', 'Book should contain comments array');
              assert.isArray(res.body.comments, 'The field comments should be an Array');
              done()
            })
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        let book = new Library({
          title: "test"
        })
        book.save(function (err, book) {
          chai
            .request(server)
            .post('/api/books/' + book._id)
            .end(function (err, res) {
              assert.equal(res.status, 200)
              assert.equal(res.body, "missing required field comment")
              done()
            })
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai
          .request(server)
          .post('/api/books/' + '6202be8721412ebe14452032') // random _id
          .send({
            comment: "test commentary"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body, "no book exists")
            done()
          })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        let book = new Library({
          title: "test"
        })
        book.save(function (err, book) {
          chai
            .request(server)
            .delete('/api/books/' + book._id)
            .end(function (err, res) {
              assert.equal(res.status, 200)
              assert.equal(res.body, "delete successful")
              done()
            })
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai
          .request(server)
          .delete('/api/books/' + '6202be8721412ebe14452032') // random _id
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body, "no book exists")
            done()
          })
      });

    });

  });

});

