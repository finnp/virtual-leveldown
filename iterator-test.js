var leveldown = require('./index.js')
var collectEntries = require('abstract-leveldown/testCommon').collectEntries
var test = require('tape')


var sourceData = [
  {type: 'put', key: '01', value: 0.1}
]

var db 


test('setup', function (t) {
  db = leveldown('1')
  db.open(function () {
    db.batch(sourceData, function () {
      var iter =db.iterator({ keyAsBuffer: false, valueAsBuffer: false })
      iter.next(function (err, key, value) {
        t.equals(key, '01')
        t.end()
      })
    })
  })
  
})



/** the following tests are mirroring the same series of tests in
* LevelUP read-stream-test.js
*/


test('setUp #2', function (t) {
  console.log('setup2')
  db.close(function () {
    db = leveldown('2')
    db.open(function () {
      db.batch(sourceData, function () {
        t.end()
      })
    })
  })
})

test('iter', function (t) {
  var iter
  iter = db.iterator({ keyAsBuffer: false, valueAsBuffer: false })
  iter.next(function (err, key, value) {
    t.equals(key, '01')
    t.end()
  })
})



