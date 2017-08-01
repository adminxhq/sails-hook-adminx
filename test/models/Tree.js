/**
 * models/Tree.js
 *
 * @description :: Custom Tree model integrated with AdminX
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {

  attributes: {
    name: { type: 'string' },
    apples: {
      collection: 'apple',
      via: 'grownBy'
    }
  }
};
