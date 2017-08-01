var Sails = require('sails').Sails;
require('should');
var request = require('supertest');

describe('Basic tests ::', function() {

  // Var to hold a running sails app instance
  var sails, httpApp, loader;

  // Initialise test variables
  var path = '/adminx';
  var dataAuthToken = '0123456';
  var dataAuthHeaderName = 'adminx-data-auth-token';

  // Before running any tests, attempt to lift Sails
  before(function (done) {

    // Hook will timeout in 10 seconds
    this.timeout(11000);

    // Attempt to lift sails
    Sails().lift({
      port: 1338,
      hooks: {
        // Load the hook
        adminx: require('../'),
        // Skip grunt (unless your hook uses it)
        grunt: false
      },
      paths: {
        models: 'test/models', // This injects the models in the right way, exposing the Waterline ORM query functions
        services: 'test/services'
      },
      connections: {
        testDiskDb: {
          adapter: 'sails-disk'
        }
      },
      models: {
        connection: 'testDiskDb',
        migrate: 'drop'
      },
      adminx: {
        dataAuthToken: dataAuthToken
      },
      globals: {
        models: true
      },
      log: {level: "verbose"}
    },function (err, _sails) {
      if (err) return done(err);

      sails = _sails;
      httpApp = sails.hooks.http.app;

      // Load test models
      // loader = require('sails-util-mvcsloader')(sails);
      // loader.adapt({
      //   models: __dirname + '/models' // Path to your test models
      // }, function(err) {
      //   // After we load the models
      //   // sails.once('hook:orm:reloaded', done);
      //   // sails.emit('hook:orm:reload');
      //   return done();
      // });
      return done();
    });
  });

  after(function (done) {
    // Clear DB by reloading Sails ORM
    sails.once('hook:orm:reloaded', done);
    sails.emit('hook:orm:reload');
    // TODO: Keep an eye if the way to do this changes
    // https://www.npmjs.com/package/sails-hook-orm#hookormreload
    // sails.hooks.orm.reload();
    done();
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

  it('/app/config auth-protected', function (done) {
    request(httpApp)
      .get(path + '/app/config')
      .set(dataAuthHeaderName, 'BAD_TOKEN') // Adding a bad token
      .expect(403)
      .end(done)
    ;
  });

  it('/app/config working', function (done) {
    request(httpApp)
      .get(path + '/app/config')
      .set(dataAuthHeaderName, dataAuthToken)
      .expect(200)
      .expect(function (res) {
        return res.body.should.be.an.Object()
          .and.have.property('schemas');
      })
      .end(done)
    ;
  });

  var schema = 'apple';
  var item = { name: 'Macintosh' };

  it('/item/list no schema param', function (done) {
    request(httpApp)
      .get(path + '/item/list')
      .set(dataAuthHeaderName, dataAuthToken)
      .expect(400)
      .end(done)
    ;
  });

  it('/item/list working', function (done) {
    request(httpApp)
      .get(path + '/item/list')
      .query({ schema: schema })
      .set(dataAuthHeaderName, dataAuthToken)
      .expect(200)
      .expect(function (res) {
        var data = res.body;

        data.should.be.an.Object();
        data.should.have.property('items');
        data.should.have.property('pageIndex'); //TODO: check if range is ok
        data.should.have.property('pageTotal'); //TODO: check if range is ok

        var items = data.items;
        items.should.be.an.Array();
      })
      .end(done)
    ;
  });

  it('/item/create working', function (done) {
    request(httpApp)
      .get(path + '/item/create')
      .query({ schema: schema, item: item })
      .set(dataAuthHeaderName, dataAuthToken)
      .expect(200)
      .expect(function (res) {
        var data = res.body;
        data.should.be.an.Object();

        item = data;
      })
      .end(done)
    ;
  });

  it('/item/update no schema param', function (done) {
    request(httpApp)
      .get(path + '/item/update')
      .set(dataAuthHeaderName, dataAuthToken)
      .expect(400)
      .end(done)
    ;
  });

  it('/item/update working', function (done) {
    request(httpApp)
      .get(path + '/item/update')
      .query({ schema: schema, id: item.id, item: item })
      .set(dataAuthHeaderName, dataAuthToken)
      .expect(200)
      .expect(function (res) {
        var data = res.body;
        data.should.be.an.Object();
        data.should.have.property('id').eql(item.id);
      })
      .end(done)
    ;
  });

  it('/item/action no schema', function (done) {
    request(httpApp)
      .get(path + '/item/action')
      .set(dataAuthHeaderName, dataAuthToken)
      .expect(400)
      .end(done)
    ;
  });

  it('/item/action working', function (done) {
    request(httpApp)
      .get(path + '/item/action')
      .query({ schema: schema, id: item.id, item: item, action: 'makeJuice', data: item })
      .set(dataAuthHeaderName, dataAuthToken)
      .expect(200)
      .expect(function (res) {
        var data = res.body;
        data.should.be.an.Object();
      })
      .end(done)
    ;
  });

  it('/item/delete no schema', function (done) {
    request(httpApp)
      .get(path + '/item/delete')
      .set(dataAuthHeaderName, dataAuthToken)
      .expect(400)
      .end(done)
    ;
  });

  it('/item/delete working', function (done) {
    request(httpApp)
      .get(path + '/item/delete')
      .query({ schema: schema, id: item.id })
      .set(dataAuthHeaderName, dataAuthToken)
      .expect(200)
      .expect(function (res) {
        var data = res.body;
        data.should.be.an.Object();
      })
      .end(done)
    ;
  });

});


