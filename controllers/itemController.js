const Item = require('../models/itemModel');
//const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createItem = factory.createOne(Item);
exports.getItem = factory.getOne(Item);
exports.getAllItem = factory.getAll(Item);
exports.updateItem = factory.updateOne(Item);
exports.deleteItem = factory.deleteOne(Item);
