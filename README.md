# uuid-time

Get time from uuids

### Motivation

So there was [this pull-request](https://github.com/broofa/node-uuid/pull/49) on the mainline [`node-uuid`](https://github.com/broofa/node-uuid) that hasn't been merged since 2012. So I decided to strip it out into a stand-alone module because I needed it.

### Usage

``` js
//
// Remark: This also works with uuids generated from
// `require('uuid');`, which is a popular fork of `node-uuid`.
//
var uuidTime = require('uuid-time'),
    uuid     = require('node-uuid');

var v1 = uuid.v1();
var buf = uuid.parse(v1);

console.log('%s (string) created at %s', v1, uuidTime.v1(v1));
console.log('%s (buffer) created at %s', v1, uuidTime.v1(buf));
```

### Attribution

Much of this code was written by [Krassimir Fotev](https://github.com/krassif) in the pull request mentioned in Motivation. It was adapted and re-released under the MIT License.

##### License: MIT
##### Author: [Charlie Robbins](https://github.com/indexzero)
