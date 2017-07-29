var Sails = require('sails').Sails;
require('should');
var request = require('supertest');

describe('Basic tests ::', function() {

  // Var to hold a running sails app instance
  var sails;
  var httpApp;

  // Before running any tests, attempt to lift Sails
  before(function (done) {

    // Hook will timeout in 10 seconds
    this.timeout(11000);

    // Attempt to lift sails
    Sails().lift({
      port: 1338,
      hooks: {
        // Load the hook
        "adminx": require('../'),
        // Skip grunt (unless your hook uses it)
        "grunt": false
      },
      log: {level: "verbose"}
    },function (err, _sails) {
      if (err) return done(err);
      sails = _sails;
      httpApp = sails.hooks.http.app;
      return done();
    });
  });

  // After tests are complete, lower Sails
  after(function (done) {

    // Lower Sails (if it successfully lifted)
    if (sails) {
      return sails.lower(done);
    }
    // Otherwise just return
    return done();
  });

  // Test that Sails can lift with the hook in place
  it ('sails does not crash', function() {
    return true;
  });


  it('sails has a valid admin config', function (done) {
    sails.config.adminx.should.be.an.Object();
    sails.config.adminx.should.have.property('authEnabled');
    sails.config.adminx.should.have.property('dataAuthToken').which.is.null();
    done();
  });

  it('working route /adminx/app', function (done) {
    request(httpApp)
      .get('/adminx/app/config')
      .expect(200, done)
      .expect(function (res) {
        res.body.should.be.an.Object()
          .and.have.property('schemas');
      });
  });

  it('working route /adminx/item/list', function (done) {
    request(httpApp)
      .get('/adminx/item/list')
      .expect(200, done)
      .expect(function (res) {
        res.body.should.be.an.Object()
          .and.have.property('items');
      });
  });

  it('working route /adminx/item/update', function (done) {
    request(httpApp)
      .get('/adminx/item/update')
      .expect(200, done)
      .expect(function (res) {
        res.body.should.be.an.Object();
      });
  });

  it('working route /adminx/item/action', function (done) {
    request(httpApp)
      .get('/adminx/item/action')
      .expect(200, done)
      .expect(function (res) {
        res.body.should.be.an.Object();
      });
  });

  it('working route /adminx/item/create', function (done) {
    request(httpApp)
      .get('/adminx/item/create')
      .expect(200, done)
      .expect(function (res) {
        res.body.should.be.an.Object();
      });
  });

  it('working route /adminx/item/delete', function (done) {
    request(httpApp)
      .get('/adminx/item/delete')
      .expect(200, done)
      .expect(function (res) {
        res.body.should.be.an.Object();
      });
  });

});


