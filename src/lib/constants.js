const { FILE_TO_SERVE } = process.env;
const STATIC_CHUNK_SIZE = 10000;
const STATIC_FOLDER = 'src/static';
const STATIC_CHUNKS_FOLDER = `${STATIC_FOLDER}/chunks`;
const STATIC_FILE_PATH = `${STATIC_FOLDER}/${FILE_TO_SERVE}`;
const CHUNK_PREFIX = 'chunk-';

module.exports = Object.freeze({
  FILE_TO_SERVE,
  STATIC_FOLDER,
  STATIC_CHUNKS_FOLDER,
  STATIC_CHUNK_SIZE,
  STATIC_FILE_PATH,
  CHUNK_PREFIX,
})
