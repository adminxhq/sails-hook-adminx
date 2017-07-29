module.exports = function myHook (sails) {
  loader = require('sails-util-mvcsloader')(sails);

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
      loader.configure();
    },

    initialize: function (cb) {
      // Assign this hook object to the `hook` var.
      // This allows us to add/modify values that users of the hook can retrieve.
      hook = this;

      //TODO: check if sails has enabled an ORM or throw an Error/Warning

      // Load controllers under ./api/controllers and services under ./services
      loader.injectAll({
      }, function(err) {
        // Signal that initialization of this hook is complete
        // by calling the callback.
        return cb();
      });
    }
  };
};
