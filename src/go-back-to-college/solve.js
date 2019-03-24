#!/usr/bin/env node

'use strict';

const {irc:solve} = require('~/lib/solve');

solve(1, (message) =>
{
  const [lhs, rhs] = message.split(/\D/)
                            .filter(Boolean)
                            .map(Number);

  return Number((lhs ** 0.5) * rhs).toFixed(2);
});
