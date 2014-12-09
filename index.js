/*
 * index.js: Top-level include for the uuid-time module
 *
 * (C) 2012 Krassif Fotev
 * MIT LICENSE
 *
 * Adapted under MIT LICENSE
 * (C) 2014 Charlie Robbins
 * MIT LICENSE
 *
 */

//
// Used under MIT from `node-uuid`
// https://github.com/broofa/node-uuid/blob/master/uuid.js#L54-L79
//
// Maps for number <-> hex string conversion
var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
  _hexToByte[_byteToHex[i]] = i;
}

// **`parse()` - Parse a UUID into it's component bytes**
function parse(s, buf, offset) {
  var i = (buf && offset) || 0, ii = 0;

  buf = buf || [];
  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
    if (ii < 16) { // Don't overflow!
      buf[i + ii++] = _hexToByte[oct];
    }
  });

  // Zero out remaining bytes if string was short
  while (ii < 16) {
    buf[i + ii++] = 0;
  }

  return buf;
}

exports.v1 = function v1time(buf, offset) {
  if (typeof buf === 'string') {
    if (offset) {
      throw new Error('Offset in string v1 uuid not valid.');
    }

    buf = parse(buf);
  }

  var msec = 0, nsec = 0;
  var i = buf && offset || 0;
  var b = buf||[];

  // inspect version at offset 6
  if ((b[i+6]&0x10)!=0x10) {
    throw new Error("uuid version 1 expected");
  }

  // 'time_low'
  var tl = 0;
  tl |= ( b[i++] & 0xff ) << 24;
  tl |= ( b[i++] & 0xff ) << 16;
  tl |= ( b[i++] & 0xff ) << 8;
  tl |=   b[i++] & 0xff ;

  // `time_mid`
  var tmh = 0;
  tmh |= ( b[i++] & 0xff ) << 8;
  tmh |=   b[i++] & 0xff;

  // `time_high_minus_version`
  tmh |= ( b[i++] & 0xf ) << 24;
  tmh |= ( b[i++] & 0xff ) << 16;

  // account for the sign bit
  msec = 1.0 * ( ( tl >>> 1 ) * 2 + ( ( tl & 0x7fffffff ) % 2 ) ) / 10000.0;
  msec += 1.0 * ( ( tmh >>> 1 ) * 2 + ( ( tmh & 0x7fffffff ) % 2 ) ) * 0x100000000 / 10000.0;

  // Per 4.1.4 - Convert from Gregorian epoch to unix epoch
  msec -= 12219292800000;

  // getting the nsec. they are not needed now though
  // nsec = ( tl & 0xfffffff ) % 10000;

  return msec;
};
