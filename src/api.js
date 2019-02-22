const express = require('express');
const api = express();
const { getFileLineText, mapChunkKeys } = require('./helpers/chunks');

mapChunkKeys();

api.get('/lines/:line_number', (req, res) =>
  getFileLineText(req.params.line_number).then((text) => {
    res
      .status(200)
      .send(text);
  }).catch(() => {
    res
      .status(413)
      .send();
  }));

api.listen(3000);

module.exports = api;
