var Sails = require('sails').Sails;
require('should');
var request = require('supertest');

describe('Basic tests ::', function() {

  // Var to hold a running sails app instance
  var sails;

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


  it('sails has admin config', function (done) {
    sails.config.adminx.should.be.an.object;
    sails.config.adminx.should.have.property('authEnabled');
    sails.config.adminx.should.have.property('dataAuthToken').which.is.null();
    done();
  });

  it('sails has route /adminx/app', function (done) {
    request(sails.hooks.http.app)
      .post('/adminx/app')
      .expect(200)
    ;
    done();
  });

});


