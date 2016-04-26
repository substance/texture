'use strict';

var fs = require('fs');
var forEach = require('lodash/forEach');
var jQuery = require('substance/util/jquery');
var Component = require('substance/ui/Component');
var Registry = require('substance/util/Registry');

var JATSImporter = require('../converter/JATSImporter');
var ArticleComponent = require('../ui/nodes/ArticleComponent');
var components = require('../ui/nodes');

var xml = fs.readFileSync(__dirname + '/../data/elife-00007.xml');
var importer = new JATSImporter();
var doc = importer.importDocument(xml);

var componentRegistry = new Registry();
forEach(components, function(ComponentClass, type) {
  componentRegistry.add(type, ComponentClass);
});

// TODO: we should put this into dedicated class
var Reader = Component.extend({
  getChildContext: function() {
    return {
      doc: doc,
      componentRegistry: componentRegistry
    };
  },
  render: function($$) {
    var articleNode = doc.get('article');
    return $$('div').append($$(ArticleComponent, { node: articleNode }));
  },
});

var $el = jQuery('<div>');
Reader.static.mount($el[0]);

fs.writeFileSync('./prerendered.html', $el.html());
