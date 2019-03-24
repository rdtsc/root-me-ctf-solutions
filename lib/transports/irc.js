'use strict';

const util     = require('util'),
      assert   = require('assert'),
      string   = require('randomstring'),
      {Client} = require('irc');

const sessionName = (() =>
{
  const lhs = string.generate({length: 1, charset: 'alphabetic'}),
        rhs = string.generate(15);

  return `${lhs}${rhs}`;
})();

module.exports = (problemId, solve) =>
{
  assert(/^(?:string|number)$/.test(typeof problemId));
  assert(solve instanceof Function);

  const endpoint = Object.freeze
  ({
    username: 'Candy',

    vocabulary:
    {
      request: `!ep${problemId}`,
      respond: `!ep${problemId} -rep %s`
    }
  });

  const bot = new Client('irc.root-me.org', sessionName,
  {
    userName: sessionName,
    realName: sessionName,
    retryCount: 0
  });

  let sentSolution = false;

  bot.once('error', (message) =>
  {
    console.error(message);
    process.exit(0);
  });

  bot.on('pm', (from, message) =>
  {
    if(from !== endpoint.username) return;

    if(!sentSolution)
    {
      sentSolution = true;

      const solution =
        util.format(endpoint.vocabulary.respond, solve(message).toString());

      bot.say(endpoint.username, solution);
    }

    else
    {
      console.log(message);
      bot.disconnect(() => process.exit(0));
    }
  });

  bot.once('registered', () =>
  {
    bot.say(endpoint.username, endpoint.vocabulary.request);
  });
};
