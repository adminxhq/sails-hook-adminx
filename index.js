const adminxHeaderAuth = require('./api/policies/adminxHeaderAuth');
const adminxController = require('./api/controllers/AdminXController');
const adminxRoutes = require('./config/routes');

module.exports = function (sails) {

  // Declare a var that will act as a reference to this hook.
  var hook;

  return {

    /* ---------
     * DEFAULTS
     * ---------
     * The defaults feature can be implemented either as an object or a function which takes a single argument (see “using
     * defaults as a function” below) and returns an object. The object you specify will be used to provide default
     * configuration values for Sails. You should use this feature to specify default settings for your hook.
     *
     * https://next.sailsjs.com/documentation/concepts/extending-sails/hooks/hook-specification/defaults
     */
    defaults: {
      adminx: {
        authEnabled: true,
        dataAuthToken: null,

        defaults: {
          listLimit: 10
        },
      },
      routes: adminxRoutes.routes

      //_hookTimeout: 20000 // wait 20 seconds before timing out
    },

    /* ----------
     * CONFIGURE
     * ----------
     * The configure feature provides a way to configure a hook after the defaults objects have been applied to all hooks.
     * By the time a custom hook’s configure() function runs, all user-level configuration and core hook settings will
     * have been merged into sails.config. However, you should not depend on other custom hooks’ configuration at this point,
     * as the load order of custom hooks is not guaranteed.
     *
     * https://next.sailsjs.com/documentation/concepts/extending-sails/hooks/hook-specification/configure
     */
    configure: function () {
      sails.log('sails-hook-adminx: Configured');
    },

    /* -----------
     * INITIALIZE
     * -----------
     * The initialize feature allows a hook to perform startup tasks that may be asynchronous or rely on other hooks.
     * All Sails configuration is guaranteed to be completed before a hook’s initialize function runs.
     *
     * https://next.sailsjs.com/documentation/concepts/extending-sails/hooks/hook-specification/initialize
     */
    initialize: function (cb) {
      // Assign this hook object to the `hook` var.
      // This allows us to add/modify values that users of the hook can retrieve.
      hook = this;

      //TODO: check if sails has enabled an ORM or throw an Error/Warning
      sails.log('sails-hook-adminx: Waiting for orm');

      var eventsToWaitFor = ['hook:orm:loaded'];
      sails.after(eventsToWaitFor, function() {
        // Finish initializing custom hook
        sails.log('sails-hook-adminx: Initialized');

        // Then call cb()
        return cb();

      });
    },

    /* -----------------
     * REGISTER ACTIONS
     * -----------------
     * If your hook adds new actions to an app, and you want to guarantee that those actions will be maintained even after
     * a call to sails.reloadActions(), you should register the actions from within a registerActions method.
     * https://next.sailsjs.com/documentation/concepts/extending-sails/hooks/hook-specification/register-actions
     */
    registerActions: function (cb) {
      sails.log('sails-hook-adminx: Registered actions');
      cb();
    },

    /*
     * ROUTES
     * The routes feature allows a custom hook to easily bind new routes to a Sails app at load time.
     * If implemented, routes should be an object with either a before key, an after key, or both.
     * The values of those keys should in turn be objects whose keys are route addresses, and whose values are route-handling
     * functions with the standard (req, res, next) parameters. Any routes specified in the before object will be bound
     * before custom user routes (as defined in sails.config.routes) and blueprint routes. Conversely, routes specified
     * in the after object will be bound after custom and blueprint routes.
     *
     * https://next.sailsjs.com/documentation/concepts/extending-sails/hooks/hook-specification/routes
     */
    routes: {
      before: {
        '/adminx*': adminxHeaderAuth,
        '/adminx/app/config': adminxController['app/config'],
        '/adminx/item/list': adminxController['item/list'],
        '/adminx/item/create': adminxController['item/create'],
        '/adminx/item/read': adminxController['item/read'],
        '/adminx/item/update': adminxController['item/update'],
        '/adminx/item/action': adminxController['item/action'],
        '/adminx/item/delete': adminxController['item/delete']
      },

      after: {

      }
    }
  };
};
