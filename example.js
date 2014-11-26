var db = require('./')('testdb')

db.open(function () {
  db.put('0', 'test', function (err) {
    if(err) throw err
      var iter = db.iterator()
      db.get('0', function (err, value) {
        console.log(value.toString())
      })
      iter.next(function (err, key, value) {
        console.log('callback?')
        if(!key) console.log('end')
          else console.log(key.toString(), value.toString())
          })
        })
})

