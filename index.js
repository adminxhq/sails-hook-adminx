module.exports = function (sails) {
  var loader = require('sails-util-mvcsloader')(sails);

  // Declare a var that will act as a reference to this hook.
  var hook;

  return {

    defaults: {
      adminx: {
        authEnabled: true,
        dataAuthToken: null
      },
      policies: {
        AdminXController: {
          '*': ['adminxHeaderAuth']
        },
      }
    },

    configure: function () {
      // Load policies under ./api/policies and config under ./config
      // https://github.com/leeroybrun/sails-util-mvcsloader#loading-config--policies
      loader.configure({
        policies: __dirname + '/api/policies',// Path to the policies to load
        config: __dirname + '/config' // Path to the config to load
      });

      //SAILS BUG: It seems sails OPTIONS requests don't return the headers configured on a per-route basis
      //SOLUTION: Modify sails.config.headers on the fly to add ours
      var headerName = 'adminx-data-auth-token';
      if (sails.config.cors.headers.indexOf(headerName) === -1) {
        sails.config.cors.headers += ',' + headerName;
      }
    },

    initialize: function (cb) {
      // Assign this hook object to the `hook` var.
      // This allows us to add/modify values that users of the hook can retrieve.
      hook = this;

      //TODO: check if sails has enabled an ORM or throw an Error/Warning

      // Load controllers under ./api/controllers and services under ./services
      // https://github.com/leeroybrun/sails-util-mvcsloader#loading-models--controllers--services
      loader.inject({
        controllers: __dirname + '/api/controllers', // Path to the controllers to load
        services: __dirname + '/api/services' // Path to the services to load
      }, function(err) {
        // Signal that initialization of this hook is complete
        // by calling the callback.
        return cb(err);
      });
    }
  };
};
