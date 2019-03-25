#!/usr/bin/env node

'use strict';

const {http:solve} = require('~/lib/solve');

const challengeEndpoint =
  'http://challenge01.root-me.org/programmation/ch1/ep1_v.php';

solve(1, ($) =>
{
  const body = $('body').text();

  const constants = body.match(/([+-]?\d+)/g)
                        .map(Number)
                        .filter(Boolean)
                        .splice(1, 4);

  const [lhs, rhs, seed, targetTermIndex] = constants;

  const operator = /\]\s*-\s*\[/.test(body) ? -1 : 1;

  let result = seed;

  for(let i = 0; i < targetTermIndex; ++i)
  {
    result = (lhs + result) + (operator * i * rhs);
  }

  return result;
}, challengeEndpoint);
