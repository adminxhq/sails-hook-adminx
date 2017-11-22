/**
 * BackofficeController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var mergeWith = require('lodash.mergewith');

module.exports = {

  'app/config': function (req, res) {
    var config = {
      schemas: []
    };

    _.each(sails.models, function (item, index) {
      if (!item.meta.junctionTable) { //TODO: is this the best way to know if a model is a junctionTable?
        var schema = {
          key: index,
          name: prepareSchemaName(item, index),
          attrs: prepareSchemaAttributes(item),
          actions: prepareSchemaActions(item)
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
      .paginate(page, limit)
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
      .then(resultFilterAll)
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
      .fetch()
      .then(resultFilterAll)
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
      .then(resultFilterAll)
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
    if (!id) return res.badRequest('id not provided');
    if (!item || !_.isObject(item)) return res.badRequest('item not provided');

    model.update({ id: id }, item)
      .fetch()
      .then(_.last)
      .then(function (item) {
        return model.findOneById(id)
          .populateAll();
      })
      .then(resultFilterAll) // Bypass 'protected' attrs
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

  'item/delete': function (req, res) {
    var schema = req.param('schema');
    var model = sails.models[schema];
    var id = req.param('id');

    // Validation
    if (!model) return res.badRequest('schema doesn\'t exist');

    model.destroy({ id: id })
      .fetch()
      .then(_.last)
      .then(resultFilterAll) // Bypass 'protected' attrs
      .then(res.ok)
      .catch(res.badRequest);
  },

};

/** PRIVATE UTILS **/

function prepareSchemaName (model, defaultName) {
  var name = defaultName;
  if(model && model.adminx && model.adminx.name) {
    name = model.adminx.name;
  }
  return _.capitalize(name);
}

function prepareSchemaAttributes (model) {
  var adminAttrs = {};
  if(model && model.adminx && model.adminx.attributes) {
    adminAttrs = _.clone(model.adminx.attributes);
  }

  var sailsAttrs = _.clone(model.attributes);
  if(!sailsAttrs) {
    throw Error('AdminX can\'t find Sails attributes, are you sure you\'re running a compatible Sails verion?');
  }

  // Fancy merge so we can keep both the order of admin fields and the dominance in the merge
  return mergeWith(adminAttrs, sailsAttrs, function customizer(objValue, srcValue, key, object, source, stack) {
    // --- IMPORTANT: Avoid modifying the original object in the stack
    // _.merge modifies the destination
    var dest = _.clone(srcValue);
    // ---
    return _.merge(dest, objValue); // order of values reversed
  });
  // return _.merge(attrs || {}, model._attributes);
}

function prepareSchemaActions (model) {
  var actions = {};
  if(model && model.adminx && model.adminx.actions) {
    actions = model.adminx.actions;
  }
  return actions;
}

function prepareSearchWhere (schema, query) {
  var model = sails.models[schema];
  var attrs = prepareSchemaAttributes(model);
  var where = { or: [] };
  _.each(attrs, function (item, index) {
    // console.log(index);
    var type = item.type;
    var o = {};
    // Make sure we don't search on dates
    if(type == 'number') {
      o[index] = query;
      where.or.push(o);
    } else if (type !== 'datetime') {
      o[index] = { contains: query };
      where.or.push(o);
    }
  });
  // console.log(where);
  return where;
}

function resultFilterAll (object) {
  //_.clone(value, [isDeep], [customizer], [thisArg])
  return _.clone(object, true);
}
