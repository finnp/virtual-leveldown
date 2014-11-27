var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN
var AbstractIterator  = require('abstract-leveldown').AbstractIterator
var inherits = require('inherits')
var leveldown = require('leveldown')
var memdown = require('memdown')
var MergeIterator = require('./merge-iterator.js')

// Iterator

function VirtualIterator(db, options) {
  AbstractIterator.call(this, db)
  
  this.memIter = db._memdown.iterator(options)
  this.levelIter = db._leveldown.iterator(options)
  
  this.iter = new MergeIterator(this.memIter, this.levelIter)
  // reverse?
  
}
inherits(VirtualIterator, AbstractIterator)

VirtualIterator.prototype._next = function (callback) {
  this.iter.next(callback)
}

VirtualIterator.prototype._end = function (callback) {
  this.iter.end(callback)
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
  this._inMemory = {}
}

VirtualDOWN.prototype._open = function (options, callback) {
  var count = 0
  this._memdown.open(options, afterOpen)
  this._leveldown.open(options, afterOpen)
  
  function afterOpen(err) {
    if(err) return callback(err)
    if(++count === 2) callback()
  }
}

VirtualDOWN.prototype._close = function (callback) {
  var count = 0
  this._memdown.close(afterClose)
  this._leveldown.close(afterClose)
  
  function afterClose(err) {
    if(err) return callback(err)
    if(++count === 2) callback()
  }
}

VirtualDOWN.prototype._get = function (key, options, callback) {
  if(this._inMemory[key]) {
    this._memdown.get(key, options, callback)
  } else {
    this._inMemory[key] = true
    this._leveldown.get(key, options, callback)
  }
}

VirtualDOWN.prototype._put = function (key, value, options, callback) {
  this._inMemory[key] = true
  this._memdown.put(key, value, options, callback)
}

VirtualDOWN.prototype._del = function (key, options, callback) {
  this._inMemory[key] = true
  this._memdown.del(key, options, callback)
}

VirtualDOWN.prototype._batch = function (array, options, callback) {
  array.forEach(function (operation) {
    this._inMemory[operation.key] = true
  }.bind(this))
  this._memdown.batch(array, options, callback)
}

VirtualDOWN.prototype._iterator =function (options) {
  return new VirtualIterator(this, options)
}