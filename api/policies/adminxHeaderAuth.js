/**
 * backofficeHeaderAuth.js
 *
 * @description :: TODO: You might write a short summary of how this policy works here.
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
module.exports = function (req, res, next) {

  if (sails.config.adminx.authEnabled) {
    var token = req.headers['adminx-data-auth-token'];

    if (token === sails.config.adminx.dataAuthToken) {
      next();
    } else {
      return res.forbidden();
    }
  } else {
    next();
  }

};
