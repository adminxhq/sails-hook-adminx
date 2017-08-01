/**
 * models/Apple.js
 *
 * @description :: Custom Apple model integrated with AdminX
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {

  attributes: {
    name: { type: 'string' },
    origin: { type: 'text', protected: true },
    email: { type: 'email' },
    quantity: {type: 'integer'},
    price: {type: 'float'},
    rippenedAt: {type: 'date'},
    pickedAt: {type: 'datetime'},
    organic: { type: 'boolean' },
    dnaSequence: { type: 'binary' },
    images: { type: 'array' },
    ratings: { type: 'array' },
    tags: { type: 'array' },
    metadata: { type: 'json' },
    grownBy: { model: 'tree' },
    relatedTo: { collection: 'apple' },
    description: { type: 'mediumtext' },
    history: { type: 'longtext' }
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
