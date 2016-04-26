var express = require('express');
var path = require('path');
var PORT = process.env.PORT || 5001;
var serverUtils = require('substance/util/server');
var app = express();

// static served data
app.use('/i18n', express.static(path.join(__dirname, 'i18n')));
app.use('/data', express.static(path.join(__dirname, 'data')));
app.use('/fonts', express.static(path.join(__dirname, 'node_modules/font-awesome/fonts')));

// Dev environment
serverUtils.serveStyles(app, '/app.css', path.join(__dirname, 'app', 'app.scss'));
serverUtils.serveJS(app, '/app.js', path.join(__dirname, 'app', 'app.js'));
serverUtils.serveHTML(app, '/', path.join(__dirname, 'app', 'index.html'), {});

// Writer example integration
serverUtils.serveStyles(app, '/writer/app.css', path.join(__dirname, 'examples/writer', 'app.scss'));
serverUtils.serveJS(app, '/writer/app.js', path.join(__dirname, 'examples/writer', 'app.js'));
serverUtils.serveHTML(app, '/writer', path.join(__dirname, 'examples/writer', 'index.html'), {});

app.listen(PORT);
console.log('Server is listening on %s', PORT);
console.log('To view the docs go to http://localhost:%s', PORT);
