# virtual-leveldown
Windows | Mac/Linux
------- | ---------
[![Windows Build status](http://img.shields.io/appveyor/ci/finnp/virtual-leveldown.svg)](https://ci.appveyor.com/project/finnp/virtual-leveldown/branch/master) | [![Build Status](https://travis-ci.org/finnp/virtual-leveldown.svg?branch=master)](https://travis-ci.org/finnp/virtual-leveldown)

LevelDOWN drop-in replacement that reads from a leveldb store, but writes
to memory. It behaves like a leveldown, but all changes (put / del) are only made
in memory, so that the original leveldb instance remains unchanged.

Install with `npm install virtual-leveldown`

Note that this is only a 3-lines tiny wrapper around [virtualdown](http://github.com/finnp/virtualdown),
that already ships with leveldown. 


## example

```js
var virtualDOWN = require('virtual-leveldown')

var db = virtualDOWN('mydatabase') // filled with cats

db.open(function () {
    db.put('doggy', 'dogdog', function (err) {
      db.get('doggy', function (value) {
        // value == 'dogdog'
        // but the dog is not in 'mydatabase' on disk
      })
    })
})
```