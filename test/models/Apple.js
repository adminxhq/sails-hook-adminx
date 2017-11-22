/**
 * models/Apple.js
 *
 * @description :: Custom Apple model integrated with AdminX
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {

  attributes: {
    name: { type: 'string' },
    origin: { type: 'string' },
    email: { type: 'string', isEmail: true },
    quantity: {type: 'number'},
    price: {type: 'number'},
    rippenedAt: {type: 'string', columnType: 'datetime'},
    pickedAt: {type: 'string', columnType: 'datetime'},
    organic: { type: 'boolean' },
    dnaSequence: { type: 'ref', columnType: 'binary' },
    images: { type: 'json', columnType: 'array' },
    ratings: { type: 'json', columnType: 'array' },
    tags: { type: 'json', columnType: 'array' },
    metadata: { type: 'json' },
    grownBy: { model: 'tree' },
    relatedTo: { collection: 'apple' },
    description: { type: 'string' },
    history: { type: 'string' }
  },

  adminx: {
    attributes: {
      id: { list:true },
      name: { list: true },
      origin: { list: true },
      images: { arrayHtmlValidation: 'url' },
      ratings: { arrayHtmlValidation: 'number' },
      createdAt: { list: true },
      updatedAt: { list: true }
    },
    actions: {
      makeJuice: {
        type: 'update',
        title: 'Make juice now!',
        description: 'Convert to lowercase the name of this model'
      }
    }
  }
};
