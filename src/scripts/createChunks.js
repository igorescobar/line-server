const exec = require('child_process').exec;
const {
  FILE_TO_SERVE,
  STATIC_CHUNKS_FOLDER,
  STATIC_CHUNK_SIZE,
  CHUNK_PREFIX,
  STATIC_FILE_PATH,
} = require('../lib/constants');

console.log(`OPTIMIZING FILE ${FILE_TO_SERVE}`);

exec(`cd ${STATIC_CHUNKS_FOLDER}; split -l ${STATIC_CHUNK_SIZE - 1} ../${FILE_TO_SERVE} ${CHUNK_PREFIX}`, (error) => {
  if (error) {
    return console.error('INVALID FILE:', STATIC_FILE_PATH);
  }

  console.log(`${STATIC_FILE_PATH} LOADED!`);
});
