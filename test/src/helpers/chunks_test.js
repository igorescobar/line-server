const { expect } = require('chai');
const {
  mapChunkKeys,
  getFileLocation,
  getFileLineText,
} = require('../../../src/helpers/chunks');

describe('#chunks', () => {
  before(mapChunkKeys);

  context('#mapChunkKeys', () => {
    it('should return the correct file', (done) => {
      mapChunkKeys()
        .then((chunks) => {
          expect(chunks).to.eql({
            '10000': 'chunk-aa',
            '20000': 'chunk-ab',
            '30000': 'chunk-ac',
            '40000': 'chunk-ad',
            '50000': 'chunk-ae',
            '60000': 'chunk-af',
            '70000': 'chunk-ag',
            '80000': 'chunk-ah',
            '90000': 'chunk-ai',
            '100000': 'chunk-aj',
            '110000': 'chunk-ak',
            '120000': 'chunk-al',
            '130000': 'chunk-am'
          });
        }).finally(done);
    });
  });

  context('#getFileLocation', () => {
    context('when using a valid line number', () => {
      it('should return the correct file', () => {
        expect(getFileLocation(10)).to.equal('10000');
        expect(getFileLocation(9999)).to.equal('10000');
        expect(getFileLocation(10000)).to.equal('10000');
        expect(getFileLocation(10001)).to.equal('20000');
        expect(getFileLocation(20001)).to.equal('30000');
        expect(getFileLocation(500000300)).to.equal(undefined);
      });
    });
  });

  context('#getFileLineText', () => {
    it('should return the first line of chunk', (done) => {
      getFileLineText(1).then((text) => {
        expect(text).to.equal('The Project Gutenberg EBook of The Adventures of Sherlock Holmes');
        done();
      })
    });

    it('should return the last line of chunk', (done) => {
      getFileLineText(10000).then((text) => {
        expect(text).to.equal('and Camden. Not once did an army of militiamen');
      }).finally(done);
    });

    it('should return empty when line is invalid', (done) => {
      getFileLineText(292929929292).catch((err) => {
        expect(err).to.equal('line not found');
      }).finally(done);
    });
  });
});
