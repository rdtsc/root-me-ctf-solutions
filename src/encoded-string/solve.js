#!/usr/bin/env node

'use strict';

const {irc:solve} = require('~/lib/solve');

solve(2, (message) => Buffer.from(message, 'base64'));
