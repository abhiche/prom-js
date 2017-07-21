const express = require('express');
const bodyParser = require('body-parser');
const supertest = require('supertest');
const prom = require('./index');
const expect = require('chai').expect;
const assert = require('assert');
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const notFound = 404;
const testUrl = '/';

describe('GET /metrics', () => {

  it('should throw error if app is not passed', (done) => {

    try {
      prom();
    } catch(e) {
      expect(e.message).to.equal('Pass express app object in the argument');
      done();
    }
  });

  it('should return status=200 and response should contain metrics', (done) => {
    prom(app);

    const request = supertest.agent(app);

    request.get(testUrl)
      .then(testMetrics)
      .then(res => {
        expect(res.status).to.equal(200);
        expect(res.text).to.include('ms_api_latency{');
        expect(res.text).to.include('ms_api_total_requests{');
        done();
      }).catch(err => done(err));

    function testMetrics(prevResponse) {
      expect(prevResponse.status).to.equal(notFound);

      return request.get('/metrics');
    }
  });
  
});



