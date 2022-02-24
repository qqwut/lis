module.exports = function(app) {
  var navigator = require('../controller/navigator-ctrl');
  app.get('/api/navigator/search', navigator.search);
};
