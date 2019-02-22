const request = require('supertest');
const api = require('../../src/api');

describe('/lines/:line_number', () => {
  it('responds with line text', () =>
    request(api)
      .get('/lines/1')
      .expect(200, /The Project Gutenberg EBook of The Adventures of Sherlock Holmes/)
  );

  it('responds with 413', (done) =>{
    request(api)
      .get('/lines/123123123123123')
      .expect(413, done)
  });
});
