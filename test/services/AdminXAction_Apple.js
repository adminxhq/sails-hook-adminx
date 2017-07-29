/**
 * AdminXAction_Apple
 *
 * @description :: Server-side logic for executing schema actions from the backoffice
 * @returns :: promise
 */
var Promise = require('bluebird');

module.exports = {
  makeJuice: function (id, item, data) {
    return new Promise(function (resolve, reject) {
      item.name = item.name.toLowerCase();
      resolve(item);
    });
  }
}
