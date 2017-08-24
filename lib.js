const responseTime = require('response-time');
const promClient = require('prom-client');
const helper = require('./helper');

module.exports = (app) => {

  if (!app && typeof app !== 'object') {
    throw new Error('Pass express app object in the argument');
  }

  const gauge = new promClient.Gauge({ name: 'ms_api_latency', help: 'Response time metrics', labelNames: [ 'method', 'status', 'url' ] });
  const counter = new promClient.Counter({ name: 'ms_api_total_requests', help: 'Total requests received', labelNames: [ 'method', 'status', 'url' ] });

  //Collect default metrics
  promClient.collectDefaultMetrics();

  // Setup middleware to evaluate latency and api hits
  app.use((req, res, next) => {

    let url = helper.stripSensitiveData(req.originalUrl);

    // Do not store metics of /metrics API
    if (url === '/metrics') {
      return next();
    }
    res.on('finish', () => {
      gauge.set({ method: req.method, status: res.statusCode, url: url }, res.get('X-Response-Time').split('ms')[0]);
      counter.inc({ method: req.method, status: res.statusCode, url: url });
    });

    responseTime()(req, res, next);
  });

  // Setup /metrics api for prometheus server to pull metrics
  app.get('/metrics', (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(promClient.register.metrics());
  });

};
