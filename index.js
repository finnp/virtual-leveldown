var leveldown = require('leveldown')
var virtualdown = require('virtualdown')
module.exports = virtualdown(leveldown)