const helper = require('./helper');
const expect = require('chai').expect;

describe('Helpers', () => {
  describe.only('ParseEndPoint', () => {

    it('should be able to parse if the url has a query string', done => {
      expect(helper.stripSensitiveData('/policies?nationId=1235')).to.be.equal('/policies');
      done();
    });

    it('should be able to parse if the url has a query string and a / before ?', done => {
      expect(helper.stripSensitiveData('/policies/?nationId=1235')).to.be.equal('/policies');
      done();
    });

    it('should be able to parse if the url has a query string and many //// before ?', done => {
      expect(helper.stripSensitiveData('/policies/////?nationId=1235')).to.be.equal('/policies');
      done();
    });

    it('should be able to parse if the url has a query string and a / at the end ?', done => {
      expect(helper.stripSensitiveData('/policies?nationId=1235////')).to.be.equal('/policies');
      done();
    });

    it('should be able to parse if the url has a param and a query string and a / at the end ?', done => {
      expect(helper.stripSensitiveData('/policies/002-123123123?nationId=1235////')).to.be.equal('/policies/:id');
      done();
    });

    it('should be able to parse if the url has a param and a query string and many / at the end and beginning of ?', done => {
      expect(helper.stripSensitiveData('/policies/002-123123123///?nationId=1235////')).to.be.equal('/policies/:id');
      done();
    });

  });
});