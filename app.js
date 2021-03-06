const webpack = require('webpack');

const webpackMiddleware = require('webpack-dev-middleware');
const webPackConfig = require('./webpack.config');
const webpackHotMiddleware = require('webpack-hot-middleware');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

// Set up the express app
const app = express();

const compiler = webpack(webPackConfig);
app.use(webpackMiddleware(compiler, {
  hot: true,
  publicPath: webPackConfig.output.publicPath,
  noInfo: true
}));
app.use(webpackHotMiddleware(compiler));

// Require routes
const users = require('./server/routes/users');
const documents = require('./server/routes/documents');
const roles = require('./server/routes/roles');

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/documentation', (req, res) => {
  res.sendFile(path.join(__dirname, './dms.html'));
});

// Require our routes into the application.
// require('./server/routes')(app);

app.use('/api', users);
app.use('/api', documents);
app.use('/api', roles);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/src/index.html'));
});

module.exports = app;
