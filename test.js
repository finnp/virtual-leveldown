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
