var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN
var AbstractIterator  = require('abstract-leveldown').AbstractIterator
var inherits = require('inherits')
var leveldown = require('leveldown')
var memdown = require('memdown')
var inMemory = {}


// Iterator

function VirtualIterator(db, options) {
  AbstractIterator.call(this, db)
  
  
  this.memIter = db._memdown.iterator(options)
  // this.levelIter = db._leveldown.iterator(options) // segmentation fault :>
  
}
inherits(VirtualIterator, AbstractIterator)

VirtualIterator.prototype._next = function (callback) {
  this.memIter.next(callback)
}

//VirtualDOWN
inherits(VirtualDOWN, AbstractLevelDOWN)
module.exports = VirtualDOWN

function VirtualDOWN(location) {
  if (!(this instanceof VirtualDOWN))
  return new VirtualDOWN(location)
  
  AbstractLevelDOWN.call(this, typeof location == 'string' ? location : '')
  
  this._leveldown = leveldown(this.location)
  this._memdown = memdown(this.location)
}



VirtualDOWN.prototype._open = function (options, callback) {
  this._leveldown.open(options, callback)
}

VirtualDOWN.prototype._close = function (options, callback) {
  this._leveldown.close(options, callback)
}

VirtualDOWN.prototype._get = function (key, options, callback) {
  if(inMemory[key]) {
    this._memdown.get(key, options, callback)
  } else {
    inMemory[key] = true
    this._leveldown.get(key, options, callback)
  }
}

VirtualDOWN.prototype._put = function (key, value, options, callback) {
  inMemory[key] = true
  this._memdown.put(key, value, options, callback)
}

VirtualDOWN.prototype._del = function (key, options, callback) {
  inMemory[key] = true
  this._memdown.del(key, options, callback)
}

VirtualDOWN.prototype._batch = function (array, options, callback) {
  array.forEach(function (operation) {
    inMemory[operation.key] = true
  })
  this._memdown.batch(array, options, callback)
}

VirtualDOWN.prototype._iterator =function (options) {
  return new VirtualIterator(this, options)
}