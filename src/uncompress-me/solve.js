#!/usr/bin/env node

'use strict';

const {irc:solve} = require('~/lib/solve');

solve(4, (message) =>
{
  const payload = Buffer.from(message, 'base64');

  return require('zlib').inflateSync(payload);
});
