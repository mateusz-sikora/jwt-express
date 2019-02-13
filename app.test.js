var utils = require('./utils');
var app = require('./app.js');
var request = require('supertest');
var express = require('express');

var credentials = { login: 'foo', password: 'bar' };

var initServer = function() {
  var server = express();
  server.use(app.router);
  return server;
}

test('Test wrong token parsing', () => {
  expect(utils.extractToken('foobar')).toBe(null);
  expect(utils.extractToken(null)).toBe(null);
  expect(utils.extractToken('')).toBe(null);
});

test('Test correct token parsing', () => {
  var token = 'foo.bar';
  expect(utils.extractToken(`Bearer ${token}`)).toBe(token);
});

test('Test protected endpoint / reject', (done) => {
  var server = initServer();
  var response = request(server)
    .get('/protected')
    .expect(403, { message: 'Access denied' })
    .end(done);
});

test('Test protected endpoint / accept', (done) => {
  var server = initServer();

  var response = request(server)
    .post('/login')
    .send(credentials)
    .expect(200)
    .end(function(err, res) {

      request(server)
        .get('/protected')
        .set('Authorization', 'Bearer ' + res.body.token)
        .expect(200, { message: 'This is protected resource!' }, done)

      return done();
    });
});

test('Test incorrect login', (done) => {
  var server = initServer();
  request(server)
    .post('/login')
    .send({ login: 'wrong', password: 'wrong' })
    .expect(400, { message: 'Invalid credentials' })
    .end(done);
});

test('Test successful login', (done) => {
  var server = initServer();
  request(server)
    .post('/login')
    .set('Content-Type', 'application/json')
    .send(credentials)
    .expect(200)
    .expect(function(res) {
      expect(res.body.message).toBe('Auth passed');
      expect(res.body.token).toEqual(expect.anything());
    })
    .end(done);
});