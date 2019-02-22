const fs = require('fs');
const byline = require('byline');

const {
  STATIC_CHUNKS_FOLDER,
  STATIC_CHUNK_SIZE,
} = require('../lib/constants');
const chunksMap = {};

const getFileLineText = (lineNumber) =>
  new Promise((resolve, reject) => {
    const fileKey = getFileLocation(lineNumber);
    let startLine = (fileKey - STATIC_CHUNK_SIZE) + 1;

    if (!fileKey) {
      return reject('line not found');
    }

    const chunkName = chunksMap[fileKey];
    const readOptions = { flags: 'r', encoding: 'utf-8' };
    const streamOptions = { keepEmptyLines: true };
    const readStream = fs.createReadStream(`${STATIC_CHUNKS_FOLDER}/${chunkName}`, readOptions);
    const stream = byline.createStream(readStream, streamOptions);

    stream.on('data', (line) => {
      if (startLine == lineNumber) {
        resolve(line);
        stream.destroy();
      }
      startLine++;
    })
    .on('end', () => reject('line not found'))
    .on('error', () => reject('line not found'));
});

const mapChunkKeys = () =>
  new Promise((resolve) => {
    let key = 1;
    fs.readdir(STATIC_CHUNKS_FOLDER, (_, files) => {
      files.forEach(file => {
        chunksMap[key * STATIC_CHUNK_SIZE] = file;
        key++;
      });
      resolve(chunksMap);
    });
  });

const getFileLocation = (lineNumber) =>
  Object
    .keys(chunksMap)
    .find((k) => {
      const start = k - STATIC_CHUNK_SIZE;
      const end = Number(k);
      return start <= lineNumber && lineNumber <= end;
    });

module.exports = {
  mapChunkKeys,
  getFileLocation,
  getFileLineText,
};
