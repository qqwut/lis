const health = require('@cloudnative/health-connect');
const modelZipCode = require('./server/model/zipCode');
const healthCheck = new health.HealthChecker();

const livenessPromise = () => new Promise((resolve, _reject) => {
  return modelZipCode.findOne()
    .then(data => resolve('query success'))
    .catch(error => reject(new Error("query failed")))
});

const readinessPromise = () => new Promise((resolve, _reject) => {
  // CASE 1 GET ENV
  if (!process.env.NODE_ENV) {
    reject(new Error("NODE_ENV is not recognized"))
  }

  // CASE 2 QUERY DB
  return modelZipCode.findOne()
    .then(data => resolve('query success'))
    .catch(error => reject(new Error("query failed")))
});

exports.registerHealthCheck = (app) => {

  // liveliness setup
  const liveliness = new health.LivenessCheck("LivenessCheck", livenessPromise);
  healthCheck.registerLivenessCheck(liveliness);
  app.use('/liveliness', health.LivenessEndpoint(healthCheck));

  // readiness setup
  // let readyCheck = new health.PingCheck("example.com");
  const readiness = new health.ReadinessCheck("ReadinessCheck", readinessPromise);
  healthCheck.registerReadinessCheck(readiness);
  app.use('/readiness', health.ReadinessEndpoint(healthCheck));

  // health setup
  app.use('/health', health.HealthEndpoint(healthCheck));
}





