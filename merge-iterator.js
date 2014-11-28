module.exports = MergeIterator

function MergeIterator(options, iter0, iter1) {
  if(!(this instanceof MergeIterator))
    return new MergeIterator(iter0, iter1)

  this.iters = [
    {iter: iter0, current: false, ended: false, id: 0},
    {iter: iter1, current: false, ended: false, id: 1}
  ]
  this.options = options
}

MergeIterator.prototype.next = function (callback) {
  var fetch0 = !this.iters[0].current
  var fetch1 = !this.iters[1].current

  if(fetch0) this.iters[0].iter.next(nextElem.bind(this, 0))
  if(fetch1) this.iters[1].iter.next(nextElem.bind(this, 1))
    
  function nextElem(id, err, key, value) {
    if(err) return callback(err)
      
    if(arguments.length === 1) {
      this.iters[id].ended = true
    } 

    this.iters[id].current = {key: key, value: value}
    if(!(this.iters[0].current && this.iters[1].current)) return

    var notEnded = this.iters.filter(function (iter) {
      return !iter.ended
    })

    var nextEntry
    var nextId
    
    var compare = this.reverse ? greater : smaller
    
    if(notEnded.length === 1) {
      nextEntry = notEnded[0].current
      notEnded[0].current = false
      nextId = notEnded[0].id
    }
    else {
      if(compare(this.iters[0].current.key, this.iters[1].current.key)) {
        nextEntry = this.iters[0].current
        this.iters[0].current = false
        nextId = 0
      } else {
        nextEntry = this.iters[1].current
        this.iters[1].current = false
        nextId = 1
      }
    }
    if(nextEntry.key) {
      callback(null, nextEntry.key, nextEntry.value, nextId)
    } else {
      callback()
    }
  }
}

function smaller(a, b) {
  return a < b
}

function greater(a, b) {
  return b > a
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
