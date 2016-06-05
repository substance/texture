var express = require('express');
var path = require('path');
var PORT = process.env.PORT || 5001;
var serverUtils = require('substance/util/server');
var app = express();

// Writer example integration
serverUtils.serveStyles(app, '/jats-editor/app.css', path.join(__dirname, 'examples/jats-editor', 'app.scss'));
serverUtils.serveJS(app, '/jats-editor/app.js', path.join(__dirname, 'examples/jats-editor', 'app.js'));
serverUtils.serveHTML(app, '/jats-editor', path.join(__dirname, 'examples/jats-editor', 'index.html'), {});

// static served data
app.use('/data', express.static(path.join(__dirname, 'examples/data')));
app.use(express.static(path.join(__dirname, 'examples')));
app.use('/fonts', express.static(path.join(__dirname, 'node_modules/font-awesome/fonts')));

app.listen(PORT);
console.log('Server is listening on %s', PORT);
console.log('To view the docs go to http://localhost:%s', PORT);
