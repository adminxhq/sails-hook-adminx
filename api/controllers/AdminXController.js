/**
 * BackofficeController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
require('should');

module.exports = {

  'app/config': function (req, res) {
    var config = {
      schemas: []
    };

    _.each(sails.models, function (item, index) {
      if (!item.meta.junctionTable) { //TODO: is this the best way to know if a model is a junctionTable?
        var schema = {
          name: index,
          attrs: prepareSchemaAttributes(item),
          actions: prepareSchemaActions(item),
        };
        config.schemas.push(schema);
      }
    });

    res.json(config);
  },

  'item/list': function (req, res) {
    var schema = req.param('schema');
    var model = sails.models[schema];
    var search = req.param('search');
    var sort = req.param('sort') || 'updatedAt desc';
    var page = req.param('page') || 1;
    var limit = req.param('limit') || 10;

    // Validation
    if (!model) return res.badRequest('schema doesn\'t exist');

    model.find()
      .where(prepareSearchWhere(schema, search))
      .sort(sort)
      .paginate({page:page, limit:limit})
      .then(function (items) {
        return model.count()
          .then(function (count) {
            return {
              items: items,
              pageIndex: (page - 1) * limit,
              pageTotal: Math.ceil(count / limit)
            };
          });
      })
      .then(UtilResult.all) // Bypass 'protected' attrs
      .then(res.ok)
      .catch(res.badRequest);
  },

  'item/read': function (req, res) {
    var schema = req.param('schema');
    var model = sails.models[schema];
    var id = req.param('id');

    // Validation
    if (!model) return res.badRequest('schema doesn\'t exist');

    model.findOneById(id)
      .populateAll()
      .then(UtilResult.all) // Bypass 'protected' attrs
      .then(res.ok)
      .catch(res.badRequest);
  },

  'item/update': function (req, res) {
    var schema = req.param('schema');
    var model = sails.models[schema];
    var id = req.param('id');
    var item = req.param('item');

    // Validation
    if (!model) return res.badRequest('schema doesn\'t exist');

    model.update(
      { id: id },
      item)
      .then(_.last)
      .then(function (item) {
        return model.findOneById(id)
          .populateAll();
      })
      .then(UtilResult.all) // Bypass 'protected' attrs
      .then(res.ok)
      .catch(res.badRequest);
  },

  'item/action': function (req, res) {
    var schema = req.param('schema');
    var model = sails.models[schema];
    var id = req.param('id');
    var item = req.param('item');
    var action = req.param('action');
    var data = req.param('data');

    // Validation
    if (!model) return res.badRequest('schema doesn\'t exist');

    var serviceName = 'adminxaction_' + schema;

    sails.services[serviceName][action](id, item, data)
      .then(res.ok)
      .catch(res.badRequest);
  },

  'item/create': function (req, res) {
    var schema = req.param('schema');
    var model = sails.models[schema];
    var item = req.param('item');

    // Validation
    if (!model) return res.badRequest('schema doesn\'t exist');

    model.create(item)
      .then(UtilResult.all) // Bypass 'protected' attrs
      .then(res.ok)
      .catch(res.badRequest);
  },

  'item/delete': function (req, res) {
    var schema = req.param('schema');
    var model = sails.models[schema];
    var id = req.param('id');

    // Validation
    if (!model) return res.badRequest('schema doesn\'t exist');

    model.destroy(id)
      .then(_.last)
      .then(UtilResult.all) // Bypass 'protected' attrs
      .then(res.ok)
      .catch(res.badRequest);
  },

};


/** UTILS **/

function prepareSchemaAttributes (model) {
  return _.merge(model.backoffice.attributes || {}, model._attributes);
}

function prepareSchemaActions (model) {
  return model.backoffice.actions || {};
}

function prepareSearchWhere (schema, query) {
  var model = sails.models[schema];
  var attrs = prepareSchemaAttributes(model);
  var where = { or: [] };
  _.each(attrs, function (item, index) {
    // console.log(index);
    var type = item.type;
    if (type !== 'date' && type !== 'datetime') {
      var o = {};
      o[index] = { contains: query };
      where.or.push(o);
    }
  });
  // console.log(where);
  return where;
}
