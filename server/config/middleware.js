var morgan = require('morgan');
var parser = require('body-parser');

module.exports = function (app, express) {
  app.use(morgan('dev'));
  app.use(parser.urlencoded({extended: true}));
  app.use(parser.json());
  app.use(express.static(__dirname + '/../../client'));
};