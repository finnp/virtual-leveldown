var test       = require('tape')
  , testCommon = require('abstract-leveldown/testCommon')
  , VirtualDOWN    = require('./')

/*** compatibility with basic LevelDOWN API ***/

require('abstract-leveldown/abstract/open-test').all(VirtualDOWN, test, testCommon)

require('abstract-leveldown/abstract/del-test').all(VirtualDOWN, test, testCommon)

require('abstract-leveldown/abstract/get-test').all(VirtualDOWN, test, testCommon)

require('abstract-leveldown/abstract/put-test').all(VirtualDOWN, test, testCommon)

require('abstract-leveldown/abstract/put-get-del-test').all(VirtualDOWN, test, testCommon, new Buffer('testtest'))

require('abstract-leveldown/abstract/batch-test').all(VirtualDOWN, test, testCommon)
// require('abstract-leveldown/abstract/chained-batch-test').all(VirtualDOWN, test, testCommon)

require('abstract-leveldown/abstract/close-test').close(VirtualDOWN, test, testCommon)

require('abstract-leveldown/abstract/iterator-test').all(VirtualDOWN, test, testCommon)

var level = require('leveldown')
test('working with original copy', function (t) {
  var location = testCommon.location()
  
  var testData = [
    {type: 'put', key: '01', value: 'cat'},
    {type: 'put', key: '02', value: 'katze'},
    {type: 'put', key: '03', value: 'gata'}
  ]
  
  t.test('init orignal db', function (t) {
    var db = level(location)
    
    db.open(function () {
      db.batch(testData, function() {
        db.close(function () {
          t.end()
        })
      })
    })
  })
  
  t.test('get original values', function (t) {
    var virtualDB = VirtualDOWN(location)
    virtualDB.open(function () {
      virtualDB.get('01',function (err, value) {
        t.notOk(err, 'no error')
        t.equals(value.toString(), 'cat')
        virtualDB.close(function () {
          t.end()
        })
      })
    })  
  })
  
  t.test('put new value', function (t) {
    var virtualDB = VirtualDOWN(location)
    
    virtualDB.open(function () {
      virtualDB.put('04', 'kissa', function () {
        virtualDB.get('04', {asBuffer: false}, function (err, value) {
          t.equals(value, 'kissa', 'added')
          virtualDB.close(function () {
            t.end()
          })
        })
      })
    })
  })
  
  t.test('del value', function (t) {
    var virtualDB = VirtualDOWN(location)
    
    virtualDB.open(function () {
      virtualDB.del('02', function () {
        virtualDB.get('02', {asBuffer: false}, function (err, value) {
          t.ok(err, 'not found')
          virtualDB.close(function () {
            t.end()
          })
        })
      })
    })
  })
  
  t.test('batch del/put', function (t) {
    var virtualDB = VirtualDOWN(location)
    
    var changes = [
      {type: 'del', key: '03'},
      {type: 'put', key: '05', value: 'chat'}
    ]
    
    virtualDB.open(function () {
      virtualDB.batch(changes, function () {
        virtualDB.get('05', {asBuffer: false}, function (err, value) {
          t.equals(value, 'chat')
          virtualDB.close(function () {
            t.end()
          })
        })
      })
    })
  })
  
  t.test('iterator', function (t) {
    var virtualDB = VirtualDOWN(location)
    
    var expected = [
      { key: '01', value: 'cat'},
      { key: '04', value: 'kissa' },
      { key: '05', value: 'chat' }
    ]
    
    virtualDB.open(function () {
      var iterator = virtualDB.iterator()
      testCommon.collectEntries(iterator, function (err, entries) {
        t.notOk(err, 'no err')
        t.equals(expected.length, entries.length, 'correct number of entries')
        entries.forEach(function (e, index) {
          t.equals(e.key.toString(), expected[index].key, 'correct key')
          t.equals(e.value.toString(), expected[index].value, 'correct value')
        })
        virtualDB.close(function () {
          t.end()
        })
      })
    })
  })
  
  t.test('unchanged original', function (t) {
    var db = level(location)
    
    db.open(function () {
      var iterator = db.iterator()
      testCommon.collectEntries(iterator, function (err, entries) {
        entries.forEach(function (e, index) {
          t.equals(e.key.toString(), testData[index].key, 'correct key')
          t.equals(e.value.toString(), testData[index].value, 'correct value')
        })
        t.end()
      })
    })
  })
})