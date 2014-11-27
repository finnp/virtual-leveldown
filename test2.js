var db = require('./index.js')('1')
var noBuffer = {keyAsBuffer: false, valueAsBuffer: false}

db.open(function () {
  db.put('test', 'test', function () {
    var iter1 = db.iterator(noBuffer)
    var iter2 = db.iterator(noBuffer)
    // console.log(iter1, iter2)
    iter1.next(function () {
      console.log(arguments)
    })
    iter2.next(function () {
      console.log(arguments)
    })
  })
})