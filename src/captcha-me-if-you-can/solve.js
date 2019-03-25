#!/usr/bin/env node

'use strict';

const fs           = require('fs'),
      cp           = require('child_process'),
      temp         = require('temp'),
      {PNG}        = require('pngjs'),
      {http:solve} = require('~/lib/solve');

temp.track();

function loadPng(dataUrl)
{
  const payload = dataUrl.substr(dataUrl.indexOf(',') + 1);

  return PNG.sync.read(Buffer.from(payload, 'base64'));
}

function removeNoise(png)
{
  const backgroundColor = {r: 0xff, g: 0xff, b: 0xff},
        noiseThreshold  = {r: 0x20, g: 0x20, b: 0x20};

  for(let y = 0; y < png.height; ++y)
  for(let x = 0; x < png.width;  ++x)
  {
    const i = (png.width * y + x) << 2;

    const isNoise = png.data[i + 0] <= noiseThreshold.r &&
                    png.data[i + 1] <= noiseThreshold.g &&
                    png.data[i + 2] <= noiseThreshold.b;

    if(isNoise)
    {
      png.data[i + 0] = backgroundColor.r;
      png.data[i + 1] = backgroundColor.g;
      png.data[i + 2] = backgroundColor.b;
    }
  }
}

function saveCaptcha(dataUrl)
{
  const png = loadPng(dataUrl);

  removeNoise(png);

  const captchaPath =
    temp.openSync({suffix: '.png'}).path;

  fs.writeFileSync(captchaPath, PNG.sync.write(png));

  return captchaPath;
}

solve(8, ($) =>
{
  const captchaPath = saveCaptcha($('img').attr('src'));

  return cp.execSync(`gocr "${captchaPath}"`)
           .toString()
           .replace(/[^a-z\d]/ig, '')
           .trim();
});
