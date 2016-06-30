'use strict';

var test = require('substance/test/test');

var forEach = require('lodash/forEach');
var includes = require('lodash/includes');
var isArray = require('lodash/isArray');
var oo = require('substance/util/oo');
var DOMElement = require('substance/ui/DOMElement');
var createJATSConfigurator = require('./createJATSConfigurator');
var JATSImporter = require('../../packages/jats/JATSImporter');

test = test.withExtension('withFixture', function(fixtureXML) {
  var tapeArgs = Array.prototype.slice.call(arguments, 1);
  var tapeish = this; // eslint-disable-line
  var t = tapeish.apply(tapeish, tapeArgs);
  t.fixture = new JATSFixture(fixtureXML);
  return t;
});

test = test.withExtension('attributesConversion', function(fixtureXML, type) {
  return this.withFixture(fixtureXML, 'Attributes should be converted.', function (t) { // eslint-disable-line
    var el = t.fixture.xmlElement;
    var importer = t.fixture.createImporter(type);
    var caption = importer.convertElement(el);
    var attr = el.getAttributes();
    forEach(attr, function(val, key) {
      t.equal(caption.attributes[key], val, "Attribute '"+key+"' should have been imported.");
    });
    var exporter = t.fixture.createExporter();
    var newEl = exporter.convertNode(caption);
    t.ok(newEl.is(el.tagName), 'Exported element should be ' + el.tagName);
    var exportedAttr = newEl.getAttributes();
    forEach(attr, function(val, key) {
      t.equal(exportedAttr[key], val, "Attribute '"+key+"' should have been exported.");
    });
    t.end();
  });
});

function JATSFixture(fixtureXML) {
  this.configurator = createJATSConfigurator();
  this.xmlElement = DOMElement.parseXML(fixtureXML);
}

JATSFixture.Prototype = function() {

  this.createImporter = function(whiteList) {
    var config = {
      schema: this.configurator.getSchema(),
      DocumentClass: this.configurator.config.schema.ArticleClass
    };
    var converters = this.configurator.getConverterRegistry().get('jats');
    if (whiteList) {
      if (arguments.length > 1) {
        whiteList = Array.prototype.slice.call(arguments, 0);
      } else if (!isArray(whiteList)) {
        whiteList = [whiteList];
      }
      whiteList.push('unsupported');
      converters = converters.filter(function(entry, name) {
        return includes(whiteList, name);
      });
    }
    config.converters = converters;
    var importer = new JATSImporter(config);
    importer.createDocument();
    return importer;
  };

  this.createExporter = function() {
    return this.configurator.createExporter('jats');
  };

};

oo.initClass(JATSFixture);

module.exports = test;
