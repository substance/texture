'use strict';

var express = require('express');
var path = require('path');
var PORT = process.env.PORT || 5001;
var serverUtils = require('substance/util/server');
var app = express();
var BaseConfigurator = require('./packages/common/BaseConfigurator');

// Writer example integration
serverUtils.serveStyles(app, '/jats-editor/app.css', {
  ConfiguratorClass: BaseConfigurator,
  configPath: path.join(__dirname, 'examples/jats-editor', 'JATSEditorConfig')
});
serverUtils.serveJS(app, '/jats-editor/app.js', path.join(__dirname, 'examples/jats-editor', 'app.js'));
serverUtils.serveHTML(app, '/jats-editor', path.join(__dirname, 'examples/jats-editor', 'index.html'), {});

serverUtils.serveStyles(app, '/science-writer/app.css', {
  ConfiguratorClass: BaseConfigurator,
  configPath: path.join(__dirname, 'examples/science-writer', 'ScienceWriterConfig')
});
serverUtils.serveJS(app, '/science-writer/app.js', path.join(__dirname, 'examples/science-writer', 'app.js'));
serverUtils.serveHTML(app, '/science-writer', path.join(__dirname, 'examples/science-writer', 'index.html'), {});

// static served data
app.use('/data', express.static(path.join(__dirname, 'examples/data')));
app.use(express.static(path.join(__dirname, 'examples')));
app.use('/fonts', express.static(path.join(__dirname, 'node_modules/font-awesome/fonts')));

serverUtils.serveTestSuite(app, "test/**/*.test.js");

app.listen(PORT);
console.log('Server is listening on %s', PORT);
console.log('To view the docs go to http://localhost:%s', PORT);
