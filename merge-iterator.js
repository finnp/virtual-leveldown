module.exports = MergeIterator

function MergeIterator(iter0, iter1) {
  if(!(this instanceof MergeIterator))
    return new MergeIterator(iter0, iter1)

  this.iters = [
    {iter: iter0, current: false, ended: false},
    {iter: iter1, current: false, ended: false}
  ]
}

MergeIterator.prototype.next = function (callback) {
  var isFirst = !this.iters[0].current
  var isSecond = !this.iters[1].current

  if(isFirst) {
    this.iters[0].iter.next(nextElem.bind(this, 0))
  }
  if(isSecond) {
    this.iters[1].iter.next(nextElem.bind(this, 1))
  }
    
  function nextElem(id, err, key, value) {
    if(err) return callback(err)
    this.iters[id].current = {key: key, value: value}
    if(!(this.iters[0].current && this.iters[1].current)) return
    
    if(arguments.length === 1) {
      this.iters[id].ended = true
    }
    
    var notEnded = this.iters.filter(function (iter) {
      return !iter.ended
    })

    var nextEntry
    
    if(notEnded.length === 1) {
      nextEntry = notEnded[0].current
      notEnded[0].current = false
    }
    else {
      if(this.iters[0].current.key < this.iters[1].current.key) {
        nextEntry = this.iters[0].current
        this.iters[0].current = false
      } else {
        nextEntry = this.iters[1].current
        this.iters[1].current = false
      }
    }

    if(nextEntry.key) {
      callback(null, nextEntry.key, nextEntry.value)
    } else {
      callback()
    }
  }
}


MergeIterator.prototype.end = function (callback) {
  var todo = this.iters.length
  this.iters[0].iter.end(iterEnd)
  this.iters[1].iter.end(iterEnd)
  
  function iterEnd(err) {
    if(err) return callback(err)
    todo--
    if(todo === 0) callback(null)
  }
}
