module.exports.all = function (object) {
  //_.clone(value, [isDeep], [customizer], [thisArg])
  return _.clone(object, true);
}
