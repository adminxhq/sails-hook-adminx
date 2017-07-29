var Sails = require('sails').Sails;
require('should');
var request = require('supertest');

describe('Basic tests ::', function() {

  // Var to hold a running sails app instance
  var sails;
  var httpApp;
  var loader;

  var dataAuthToken = '0123456';

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
      globals: {
        // _ : true,
        // async: true,
        // models: true,
        // sails: true
      },
      adminx: {
        dataAuthToken: dataAuthToken
      },
      log: {level: "verbose"}
    },function (err, _sails) {
      if (err) return done(err);

      sails = _sails;
      httpApp = sails.hooks.http.app;

      // Load test models
      loader = require('sails-util-mvcsloader')(sails);
      loader.injectAll({
        models: __dirname + '/models' // Path to your test models
      }, function(err) {
        return done();
      });
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

  it ('sails has loaded test models', function() {
    sails.models.apple.should.be.an.Object();
  });

  it('sails has a valid admin config', function (done) {
    sails.config.adminx.should.be.an.Object();
    sails.config.adminx.should.have.property('authEnabled');
    sails.config.adminx.should.have.property('dataAuthToken');
    done();
  });

  it('route /adminx/app/config protected', function (done) {
    request(httpApp)
      .get('/adminx/app/config')
      .set('adminx-data-auth-token', 'BAD_TOKEN')
      .expect(403)
      .end(done)
    ;
  });

  it('working route /adminx/app/config', function (done) {
    request(httpApp)
      .get('/adminx/app/config')
      .set('adminx-data-auth-token', dataAuthToken)
      .expect(200)
      .expect(function (res) {
        return res.body.should.be.an.Object()
          .and.have.property('schemas');
      })
      .end(done)
    ;
  });

  it('working route /adminx/item/list', function (done) {
    request(httpApp)
      .get('/adminx/item/list')
      .set('adminx-data-auth-token', dataAuthToken)
      .expect(200)
      .expect(function (res) {
        res.body.should.be.an.Object()
          .and.have.property('items');
      })
      .end(done)
    ;
  });

  it('working route /adminx/item/update', function (done) {
    request(httpApp)
      .get('/adminx/item/update')
      .set('adminx-data-auth-token', dataAuthToken)
      .expect(200)
      .expect(function (res) {
        res.body.should.be.an.Object();
      })
      .end(done)
    ;
  });

  it('working route /adminx/item/action', function (done) {
    request(httpApp)
      .get('/adminx/item/action')
      .set('adminx-data-auth-token', dataAuthToken)
      .expect(200)
      .expect(function (res) {
        res.body.should.be.an.Object();
      })
      .end(done)
    ;
  });

  it('working route /adminx/item/create', function (done) {
    request(httpApp)
      .get('/adminx/item/create')
      .set('adminx-data-auth-token', dataAuthToken)
      .expect(200)
      .expect(function (res) {
        res.body.should.be.an.Object();
      })
      .end(done)
    ;
  });

  it('working route /adminx/item/delete', function (done) {
    request(httpApp)
      .get('/adminx/item/delete')
      .set('adminx-data-auth-token', dataAuthToken)
      .expect(200)
      .expect(function (res) {
        res.body.should.be.an.Object();
      })
      .end(done)
    ;
  });

  it('working route /backoffice/item/delete', function (done) {
    request(httpApp)
      .get('/backoffice/item/delete')
      .set('adminx-data-auth-token', dataAuthToken)
      .expect(200)
      .expect(function (res) {
        res.body.should.be.an.Object();
      })
      .end(done)
    ;
  });

});


