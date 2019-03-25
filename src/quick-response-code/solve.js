#!/usr/bin/env node

'use strict';

const JsQr         = require('jsqr'),
      {PNG}        = require('pngjs'),
      {http:solve} = require('~/lib/solve');

function loadPng(dataUrl)
{
  const payload = dataUrl.substr(dataUrl.indexOf(',') + 1);

  return PNG.sync.read(Buffer.from(payload, 'base64'));
}

function renderQrPositionMarker(png, left, top, width)
{
  const square = (i, j, w, color) =>
  {
    for(let y = j; y < (w + j); ++y)
    for(let x = i; x < (w + i); ++x)
    {
      const i = (png.width * y + x) << 2;

      png.data[i + 0] = color;
      png.data[i + 1] = color;
      png.data[i + 2] = color;
    }
  };

  square(left +  0, top +  0, width -  0, 0x00);
  square(left + 10, top + 10, width - 20, 0xff);
  square(left + 20, top + 20, width - 40, 0x00);
}

solve(7, ($) =>
{
  const png = loadPng($('img').attr('src'));

  const injectQrMarker = (l, t, w = 64) =>
    renderQrPositionMarker(png, l, t, w);

  injectQrMarker(20,  20);
  injectQrMarker(20, 220);
  injectQrMarker(220, 20);

  const result = JsQr(png.data, png.width, png.height);

  if(!result || !/key is/i.test(result.data)) return;

  return `/${result.data.split('/')[1]}`;
});
