module.exports = function myHook(sails) {

  // This var will be private
  var foo = 'bar';

  // This var will be public
  this.abc = 123;

  // Declare a var that will act as a reference to this hook.
  var hook;

  return {

    defaults: {
      __configKey__: {
        authEnabled: true,
        dataAuthToken: null
      }
    },

    configure: function() {

    },

    initialize: function(cb) {
      // Assign this hook object to the `hook` var.
      // This allows us to add/modify values that users of the hook can retrieve.
      //hook = this;

      // Signal that initialization of this hook is complete
      // by calling the callback.
      return cb();
    },

    routes: {
      before: {
        'GET /*': function (req, res, next) {
          // hook.numRequestsSeen++;
          return next();
        },

        '/adminx/app/config': function (req, res, next) {
          var config = {
            schemas: []
          };
          res.json(config);
        }
      },
      after: {
        'GET /*': function (req, res, next) {
          // hook.numUnhandledRequestsSeen++;
          return next();
        }
      }
    },

    // This function will be public
    sayHi: function (name) {
      console.log(greet(name));
    },

  };

  // This function will be private
  function greet (name) {
    return "Hi, " + name + "!";
  }

};
