'use strict';

const assert = require('assert'),
      cheerio = require('cheerio'),
      request = require('request-promise-native');

module.exports = async (problemId, solve, submissionEndpointUri) =>
{
  assert(/^(?:string|number)$/.test(typeof problemId));
  assert(solve instanceof Function);

  const requestOptions =
  {
    method: 'GET',
    simple: false,
    resolveWithFullResponse: true,
    uri: `http://challenge01.root-me.org/programmation/ch${problemId}/`
  };

  let response = await request(requestOptions);

  assert(response.statusCode === 200);

  const $ = cheerio.load(response.body);

  const solution = solve($);

  if(typeof solution === 'undefined') return;

  const payload = encodeURIComponent(solution.toString());

  requestOptions.headers =
  {
    cookie: response.headers['set-cookie'][0]
  };

  if($('input[name]').length)
  {
    const responseField =
      $('input[name]').attr('name');

    requestOptions.method = 'POST';

    requestOptions.body =
      `${responseField}=${payload}`;

    requestOptions.headers['content-type'] =
      'application/x-www-form-urlencoded';
  }

  else if(submissionEndpointUri)
  {
    requestOptions.uri =
      `${submissionEndpointUri}?result=${payload}`;
  }

  response = await request(requestOptions);

  assert(response.statusCode === 200);

  if(!submissionEndpointUri)
  {
    const $ = cheerio.load(response.body);
    console.log($('p').text().trim());
  }

  else
  {
    console.log(response.body.trim());
  }
};
